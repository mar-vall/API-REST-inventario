import swaggerJsdoc, { Options } from "swagger-jsdoc";

const options: Options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Inventory API",
      version: "1.0.0",
      description:
        "REST API for managing products, orders, and inventory movements.",
    },
    servers: [
      {
        url: "http://localhost:3000/api",
      },
    ],
    tags: [
      { name: "Products", description: "Management of products" },
      { name: "Orders", description: "Management of orders" },
      { name: "Inventory", description: "Inventory movements" },
    ],
    components: {
      schemas: {
        CreateProductDto: {
          type: "object",
          required: ["name", "description", "unit_price", "stock"],
          properties: {
            name: {
              type: "string",
              example: "Laptop HP",
            },
            description: {
              type: "string",
              example: "Laptop de alto rendimient",
            },
            unit_price: {
              type: "number",
              minimum: 0,
              example: 2500.5,
            },
            stock: {
              type: "integer",
              minimum: 0,
              example: 10,
            },
          },
        },
        UpdateProductDto: {
          type: "object",
          properties: {
            name: {
              type: "string",
              example: "Laptop HP Pro",
            },
            description: {
              type: "string",
              example: "Laptop de alto rendimiento con mejoras",
            },
            unit_price: {
              type: "number",
              minimum: 0,
              example: 2800,
            },
            stock: {
              type: "integer",
              minimum: 0,
              example: 5,
            },
            isActive: {
              type: "boolean",
              example: true,
            },
          },
        },
        ProductResponse: {
          type: "object",
          properties: {
            id: { type: "string", example: "uuid-123" },
            name: { type: "string", example: "Laptop HP" },
            unit_price: { type: "number", example: 2500.5 },
            stock: { type: "integer", example: 10 },
            isActive: { type: "boolean", example: true },
            createdAt: {
              type: "string",
              format: "date-time",
            },
          },
        },
        ErrorResponse: {
          type: "object",
          properties: {
            error: {
              type: "object",
              properties: {
                code: {
                  type: "string",
                  example: "VALIDATION_ERROR",
                },
                message: {
                  type: "string",
                  example: "Validation failed.",
                },
                status: {
                  type: "integer",
                  example: 400,
                },
                details: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      field: {
                        type: "string",
                        example: "email",
                      },
                      issue: {
                        type: "string",
                        example: "Missing @ symbol",
                      },
                    },
                  },
                },
                timestamp: {
                  type: "string",
                  format: "date-time",
                },
                path: {
                  type: "string",
                  example: "/api/products/123",
                },
              },
            },
          },
        },
        ProductHistory: {
          type: "object",
          properties: {
            id: { type: "string" },
            productId: { type: "string" },
            fieldName: { type: "string", example: "unit_price" },
            oldValue: { type: "string", example: "100.00" },
            newValue: { type: "string", example: "120.00" },
            changedAt: { type: "string", format: "date-time" },
          },
        },
        AdjustInventory: {
          type: "object",
          required: ["productId", "quantity"],
          properties: {
            productId: {
              type: "string",
              format: "uuid",
              example: "550e8400-e29b-41d4-a716-446655440000",
            },
            quantity: {
              type: "integer",
              minimum: 1,
              example: 10,
            },
            reason: {
              type: "string",
              example: "Purchase from supplier",
            },
          },
        },
        InventoryMovement: {
          type: "object",
          properties: {
            id: { type: "string", format: "uuid" },
            productId: { type: "string", format: "uuid" },
            type: { type: "string", enum: ["IN", "OUT"] },
            quantity: { type: "integer" },
            stockBefore: { type: "integer" },
            stockAfter: { type: "integer" },
            reason: { type: "string" },
            created_at: { type: "string", format: "date-time" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
