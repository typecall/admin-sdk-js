# @typecall/admin-sdk

Official TypeScript/JavaScript Admin SDK for Typecall.

> **Note**: This open-source SDK provides a client library for interacting with Typecall APIs. To use this SDK, you must have an active Typecall account and administrative API credentials.

[![CI](https://github.com/typecall/admin-sdk-js/actions/workflows/ci.yml/badge.svg)](https://github.com/typecall/admin-sdk-js/actions/workflows/ci.yml)
[![npm version](https://img.shields.io/npm/v/@typecall/admin-sdk.svg)](https://www.npmjs.com/package/@typecall/admin-sdk)
[![License: Apache-2.0](https://img.shields.io/badge/License-Apache_2.0-blue.svg)](./LICENSE)

---

## Prerequisites

- An active [Typecall Account](https://typecall.com)
- An Admin API key generated from the [Typecall Dashboard](https://dashboard.typecall.com/api-keys)
- Node.js 24+ (or compatible runtimes like Bun, Deno, Cloudflare Workers, or modern browsers)

## Features

- **Dual Module Output**: Native ESM (`import`) and CommonJS (`require`) support.
- **Strictly Typed**: Full TypeScript declarations with sourcemaps included.
- **Zero Runtime Dependencies**: Built entirely on standard `fetch`.
- **Customizable**: Built-in error classes, typed request/response handling, configurable timeouts, custom headers, and custom fetch injection.

## Installation

```bash
npm install @typecall/admin-sdk
# or
pnpm add @typecall/admin-sdk
# or
yarn add @typecall/admin-sdk
```

## Quick Start

```typescript
import { TypecallAdmin } from "@typecall/admin-sdk";

const client = new TypecallAdmin({
  apiKey: process.env.TYPECALL_API_KEY!,
});

// Example request
const org = await client.request<{ id: string; name: string }>("/orgs/me");
console.log(org);
```

## Issues & Support

- **Client SDK Bugs & Feature Requests**: Please [open a GitHub issue](https://github.com/typecall/admin-sdk-js/issues) for issues with the JavaScript/TypeScript client library.
- **Platform Inquiries & Account Support**: For account access, billing, or platform questions, please contact [support@typecall.com](mailto:support@typecall.com).
- **Service Status**: Check [status.typecall.com](https://status.typecall.com) for real-time API uptime and incident reports.

## License

This SDK is distributed under the [Apache License, Version 2.0](./LICENSE).

Use of the Typecall platform, APIs, and services is governed by the [Typecall Terms of Service](https://typecall.com/terms) and [Privacy Policy](https://typecall.com/privacy).
