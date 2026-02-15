/* eslint-disable */
// AUTO-GENERATED. DO NOT EDIT.
// Source: http://127.0.0.1:3101/docs/openapi.json
const oas = {
  openapi: "3.1.1",
  info: {
    title: "Multiplexer Backend Documentation",
    description:
      "\n  > [!tip]\n  > Work in progress\n\n  **Version**: 1.0.0\n        ",
    version: "1.0.0",
  },
  components: {
    schemas: {},
  },
  paths: {
    "/prices": {
      get: {
        tags: ["Price"],
        description: "Get last real-time price for a symbol",
        parameters: [
          {
            schema: {
              type: "string",
            },
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
                  type: "number",
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
        tags: ["Candles"],
        parameters: [
          {
            schema: {
              type: "string",
            },
            in: "query",
            name: "symbol",
            required: true,
          },
          {
            schema: {
              type: "number",
            },
            in: "query",
            name: "interval",
            required: true,
          },
          {
            schema: {
              default: 50,
              type: "number",
            },
            in: "query",
            name: "outputsize",
            required: false,
          },
          {
            schema: {
              type: "number",
            },
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
                      time: {
                        type: "number",
                      },
                      open: {
                        type: "number",
                      },
                      high: {
                        type: "number",
                      },
                      low: {
                        type: "number",
                      },
                      close: {
                        type: "number",
                      },
                      volume: {
                        type: "number",
                      },
                    },
                    required: [
                      "time",
                      "open",
                      "high",
                      "low",
                      "close",
                      "volume",
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
        tags: ["Candles"],
        parameters: [
          {
            schema: {
              type: "string",
            },
            in: "query",
            name: "symbol",
            required: true,
          },
          {
            schema: {
              type: "number",
            },
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
                  anyOf: [
                    {
                      type: "object",
                      properties: {
                        time: {
                          type: "number",
                        },
                        open: {
                          type: "number",
                        },
                        high: {
                          type: "number",
                        },
                        low: {
                          type: "number",
                        },
                        close: {
                          type: "number",
                        },
                        volume: {
                          type: "number",
                        },
                      },
                      required: [
                        "time",
                        "open",
                        "high",
                        "low",
                        "close",
                        "volume",
                      ],
                    },
                    {
                      type: "null",
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/simulations": {
      get: {
        tags: ["Simulations"],
        description: "Get all active simulations",
        parameters: [
          {
            schema: {
              type: "string",
            },
            in: "query",
            name: "status",
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
                  items: {},
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
      post: {
        tags: ["Simulations"],
        description: "Start a new simulation",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  symbol: {
                    type: "string",
                  },
                  startTime: {
                    anyOf: [
                      {
                        description: "ISO 8601 date-time string",
                        format: "iso-date-time",
                        type: "string",
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                  stages: {
                    minItems: 1,
                    type: "array",
                    items: {
                      anyOf: [
                        {
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                              enum: ["TO_TARGET"],
                            },
                            target: {
                              type: "number",
                            },
                            duration: {
                              minimum: 1,
                              type: "integer",
                            },
                          },
                          required: ["type", "target", "duration"],
                        },
                        {
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                              enum: ["FLAT"],
                            },
                            range: {
                              type: "number",
                            },
                            duration: {
                              minimum: 1,
                              type: "integer",
                            },
                          },
                          required: ["type", "range", "duration"],
                        },
                        {
                          type: "object",
                          properties: {
                            type: {
                              type: "string",
                              enum: ["REVERT"],
                            },
                            duration: {
                              minimum: 1,
                              type: "integer",
                            },
                          },
                          required: ["type", "duration"],
                        },
                      ],
                    },
                  },
                },
                required: ["symbol", "stages"],
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Success",
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  properties: {
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/simulations/reschedule/{id}": {
      patch: {
        tags: ["Simulations"],
        description: "Rschedule simulation",
        requestBody: {
          content: {
            "application/json": {
              schema: {
                type: "object",
                properties: {
                  startTime: {
                    anyOf: [
                      {
                        description: "ISO 8601 date-time string",
                        format: "iso-date-time",
                        type: "string",
                      },
                      {
                        type: "null",
                      },
                    ],
                  },
                },
              },
            },
          },
        },
        parameters: [
          {
            schema: {
              format: "uuid",
              type: "string",
            },
            in: "path",
            name: "id",
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
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/simulations/abort/{id}": {
      patch: {
        tags: ["Simulations"],
        description: "Abort running simulation",
        requestBody: {
          content: {
            "application/json": {
              schema: {},
            },
          },
        },
        parameters: [
          {
            schema: {
              format: "uuid",
              type: "string",
            },
            in: "path",
            name: "id",
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
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
                  required: ["error"],
                },
              },
            },
          },
        },
      },
    },
    "/admin/simulations/{id}": {
      delete: {
        tags: ["Simulations"],
        description: "DANGER! (TO DO) Delete a simulation by ID",
        parameters: [
          {
            schema: {
              format: "uuid",
              type: "string",
            },
            in: "path",
            name: "id",
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
                    message: {
                      type: "string",
                    },
                  },
                  required: ["message"],
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    error: {
                      type: "string",
                    },
                  },
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
                  properties: {
                    initialized: {
                      type: "boolean",
                    },
                  },
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
                properties: {
                  password: {
                    minLength: 6,
                    type: "string",
                  },
                },
                required: ["password"],
              },
            },
          },
          required: true,
        },
        responses: {
          "200": {
            description: "Default Response",
          },
        },
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
                properties: {
                  password: {
                    type: "string",
                  },
                },
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
                  properties: {
                    success: {
                      type: "boolean",
                      enum: [true],
                    },
                  },
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
                  properties: {
                    success: {
                      type: "boolean",
                      enum: [true],
                    },
                  },
                  required: ["success"],
                },
              },
            },
          },
        },
      },
    },
  },
  externalDocs: {
    url: "https://swagger.io",
    description: "Find more info here",
  },
} as const;
export default oas;
