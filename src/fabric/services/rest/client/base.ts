import MiniSearch from "minisearch";
import { atom, type ReadableAtom, type WritableAtom } from "nanostores";

export type { ReadableAtom };

export interface RestTransport {
  request<T>(path: string, init?: RequestInit): Promise<T>;
  requestData<T>(path: string, init?: RequestInit): Promise<T>;
  requestBlob(path: string, init?: RequestInit): Promise<Blob>;
}

export abstract class BaseResourceClient<T extends { id: string } = any> {
  protected readonly items = new Map<string, T>();
  protected isLoaded = false;
  protected searchIndex?: MiniSearch;

  private readonly _version: WritableAtom<number> = atom(1);

  readonly $version: ReadableAtom<number> = this._version;

  get version(): number {
    return this._version.get();
  }

  get loaded(): boolean {
    return this.isLoaded;
  }

  constructor(protected readonly transport: RestTransport) {}

  /**
   * Returns all items currently stored in cache.
   */
  all(): T[] {
    return Array.from(this.items.values());
  }

  /**
   * Synchronously finds an item in cache by ID.
   */
  find(id: string): T | undefined {
    return this.items.get(id);
  }

  /**
   * Synchronously finds multiple items in cache by ID.
   */
  getMany(...ids: string[]): T[] {
    const results: T[] = [];
    for (const id of ids) {
      const item = this.items.get(id);
      if (item) results.push(item);
    }
    return results;
  }

  /**
   * Searches cached items by search term using MiniSearch prefix matching.
   * If search term is empty, returns all items.
   */
  search(term: string): T[] {
    const trimmed = term.trim();
    if (!trimmed || !this.searchIndex) {
      return this.all();
    }
    const results = this.searchIndex.search(trimmed, { prefix: true });
    const matched: T[] = [];
    for (const r of results) {
      const item = this.items.get(r.id);
      if (item) matched.push(item);
    }
    return matched;
  }

  /**
   * Hook for subclasses to define what fields get indexed for search.
   */
  protected extractSearchTerms(item: T): string {
    return Object.values(item as Record<string, unknown>)
      .filter((v) => typeof v === "string" || typeof v === "number")
      .join(" ")
      .toLowerCase();
  }

  /**
   * Adds or replaces an item in the search index.
   */
  protected indexItem(item: T): void {
    if (!this.searchIndex) {
      this.searchIndex = new MiniSearch({
        fields: ["terms"],
        storeFields: ["id"],
      });
    }
    const doc = { id: item.id, terms: this.extractSearchTerms(item) };
    if (this.searchIndex.has(item.id)) {
      this.searchIndex.replace(doc);
    } else {
      this.searchIndex.add(doc);
    }
  }

  /**
   * Sets or updates a single item in cache and search index.
   */
  protected setItem(item: T): void {
    this.items.set(item.id, item);
    this.indexItem(item);
  }

  /**
   * Removes a single item from cache and search index.
   */
  protected removeItem(id: string): void {
    this.items.delete(id);
    if (this.searchIndex?.has(id)) {
      this.searchIndex.discard(id);
    }
  }

  /**
   * Populates cache and search index with all items, marking the client as loaded.
   */
  protected setAll(items: T[]): void {
    this.items.clear();
    this.searchIndex?.removeAll();
    for (const item of items) {
      this.items.set(item.id, item);
      this.indexItem(item);
    }
    this.isLoaded = true;
    this.bump();
  }

  /**
   * Clears the in-memory cache and search index.
   */
  clearCache(): void {
    this.items.clear();
    this.searchIndex?.removeAll();
    this.isLoaded = false;
    this.bump();
  }

  bump(): void {
    this._version.set(this._version.get() + 1);
  }
}
