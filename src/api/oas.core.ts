const oas = {
  openapi: "3.1.1",
  info: {
    title: "Core Backend Documentation",
    description:
      "\n  > [!tip]\n  > Work in progress\n\n  **Version**: 1.0.0\n        ",
    version: "1.0.0",
  },
  components: { schemas: {} },
  paths: {
    "/assets": {
      get: {
        summary: "Get one or all assets",
        tags: ["Assets"],
        description: "Returns all assets if no symbol is provided",
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: false,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  anyOf: [
                    {
                      type: "array",
                      items: {
                        type: "object",
                        properties: {
                          symbol: { type: "string" },
                          exchange: { type: "string" },
                          type: { type: "string" },
                          description: { type: "string" },
                          image_url: {
                            anyOf: [{ type: "string" }, { type: "null" }],
                          },
                          tick_size: {
                            anyOf: [{ type: "number" }, { type: "null" }],
                          },
                        },
                        required: [
                          "symbol",
                          "exchange",
                          "type",
                          "description",
                          "tick_size",
                        ],
                      },
                    },
                    {
                      type: "object",
                      properties: {
                        symbol: { type: "string" },
                        exchange: { type: "string" },
                        type: { type: "string" },
                        description: { type: "string" },
                        image_url: {
                          anyOf: [{ type: "string" }, { type: "null" }],
                        },
                        tick_size: {
                          anyOf: [{ type: "number" }, { type: "null" }],
                        },
                      },
                      required: [
                        "symbol",
                        "exchange",
                        "type",
                        "description",
                        "tick_size",
                      ],
                    },
                  ],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/assets/search": {
      get: {
        summary: "Search assets",
        tags: ["Assets"],
        description:
          "Returns assets that match the query (description or symbol)",
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "query",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      symbol: { type: "string" },
                      exchange: { type: "string" },
                      type: { type: "string" },
                      description: { type: "string" },
                      image_url: {
                        anyOf: [{ type: "string" }, { type: "null" }],
                      },
                      tick_size: {
                        anyOf: [{ type: "number" }, { type: "null" }],
                      },
                    },
                    required: [
                      "symbol",
                      "exchange",
                      "type",
                      "description",
                      "tick_size",
                    ],
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/candles": {
      get: {
        summary: "Get historical candles",
        tags: ["Candles"],
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: true,
          },
          {
            schema: { minimum: 60, type: "number" },
            in: "query",
            name: "interval",
            required: true,
          },
          {
            schema: { default: 50, type: "number" },
            in: "query",
            name: "outputsize",
            required: false,
          },
          {
            schema: { minimum: 0, type: "number" },
            in: "query",
            name: "before",
            required: false,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      open: { type: "number" },
                      high: { type: "number" },
                      low: { type: "number" },
                      close: { type: "number" },
                      volume: { type: "number" },
                      time: { type: "number" },
                    },
                    required: [
                      "open",
                      "high",
                      "low",
                      "close",
                      "volume",
                      "time",
                    ],
                  },
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/candles/last": {
      get: {
        summary: "Get last candle",
        tags: ["Candles"],
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: true,
          },
          {
            schema: { minimum: 60, type: "number" },
            in: "query",
            name: "interval",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    open: { type: "number" },
                    high: { type: "number" },
                    low: { type: "number" },
                    close: { type: "number" },
                    volume: { type: "number" },
                    time: { type: "number" },
                  },
                  required: ["open", "high", "low", "close", "volume", "time"],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/prices": {
      get: {
        summary: "Get current price",
        tags: ["Prices"],
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    timestamp: { type: "number" },
                    value: { type: "number" },
                    volume: { type: "number" },
                  },
                  required: ["timestamp", "value"],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/storage/{filename}": {
      get: {
        summary: "Get file",
        tags: ["Storage"],
        parameters: [
          {
            schema: { type: "string" },
            in: "path",
            name: "filename",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: { "application/json": { schema: {} } },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/assets": {
      post: {
        summary: "Add new asset",
        tags: ["Admin"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  symbol: { type: "string" },
                  exchange: { type: "string" },
                  type: { type: "string" },
                  description: { type: "string" },
                  image_url: { anyOf: [{ type: "string" }, { type: "null" }] },
                },
                required: ["symbol", "exchange", "type", "description"],
              },
            },
          },
          required: true,
        },
        responses: {
          "201": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", enum: [true] } },
                  required: ["success"],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
      put: {
        summary: "Update existing asset",
        tags: ["Admin"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  type: { type: "string" },
                  description: { type: "string" },
                  image_url: { anyOf: [{ type: "string" }, { type: "null" }] },
                },
                required: ["type", "description"],
              },
            },
          },
          required: true,
        },
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean" } },
                  required: ["success"],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
      delete: {
        summary: "Delete asset",
        tags: ["Admin"],
        parameters: [
          {
            schema: { type: "string" },
            in: "query",
            name: "symbol",
            required: true,
          },
        ],
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean" } },
                  required: ["success"],
                },
              },
            },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/storage/upload": {
      post: {
        summary: "Upload image to storage",
        tags: ["Admin"],
        responses: {
          "200": {
            description: "Success",
            content: { "application/json": { schema: {} } },
          },
          "400": {
            description: "Bad Request",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "404": {
            description: "Not Found",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
          "500": {
            description: "Internal Server Error",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { error: { type: "string" } },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/auth/status": {
      get: {
        summary: "Check if password is set",
        tags: ["Admin"],
        responses: {
          "200": {
            description: "Default Response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { initialized: { type: "boolean" } },
                  required: ["initialized"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/auth/setup": {
      post: {
        summary: "Set password",
        tags: ["Admin"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { password: { minLength: 6, type: "string" } },
                required: ["password"],
              },
            },
          },
          required: true,
        },
        responses: { "200": { description: "Default Response" } },
      },
    },
    "/admin/auth/login": {
      post: {
        summary: "Login",
        tags: ["Admin"],
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: { password: { type: "string" } },
                required: ["password"],
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Default Response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", enum: [true] } },
                  required: ["success"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/auth/logout": {
      post: {
        summary: "Logout",
        tags: ["Admin"],
        responses: {
          "200": {
            description: "Default Response",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: { success: { type: "boolean", enum: [true] } },
                  required: ["success"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/restart": {
      post: { responses: { "200": { description: "Default Response" } } },
    },
  },
  externalDocs: {
    url: "https://swagger.io",
    description: "Find more info here",
  },
} as const;
export default oas;
