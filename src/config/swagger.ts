import { getMetadataStorage } from "class-validator";
import swaggerJsdoc, { Options } from "swagger-jsdoc";
import { validationMetadatasToSchemas } from "class-validator-jsonschema";
import "../dtos/inventory.dto";
import "../dtos/product.dto";
import "../dtos/order.dto";

const dtoSchemas = validationMetadatasToSchemas({
  classValidatorMetadataStorage: getMetadataStorage(),
});

const customSchemas = {
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
  InventoryMovement: {
    type: "object",
    properties: {
      id: { type: "string", format: "uuid" },
      productId: { type: "string", format: "uuid" },
      type: {
        type: "string",
        enum: ["IN", "OUT"],
      },
      quantity: { type: "integer" },
      stockBefore: { type: "integer" },
      stockAfter: { type: "integer" },
      reason: { type: "string" },
      created_at: { type: "string", format: "date-time" },
    },
  },
  AdjustInventoryResponse: {
    type: "object",
    properties: {
      message: { type: "string", example: "Stock increased successfully" },
      stock: { type: "integer", example: 15},
    },
  },
  OrderResponse: {
      type: "object",
      properties: {
        id: {
          type: "string",
          format: "uuid",
        },
        customerName: {
          type: "string",
        },
        address: {
          type: "string",
        },
        notes: {
          type: "string",
          nullable: true,
        },
        status: {
          type: "string",
          enum: ["PENDING", "CONFIRMED", "SHIPPED", "DELIVERED", "CANCELLED"],
        },
        totalAmount: {
          type: "number",
          format: "decimal",
          example: 120.50,
        },
        createdAt: {
          type: "string",
          format: "date-time",
        },
        updatedAt: {
          type: "string",
          format: "date-time",
        },
      },
    },
};

const schemas = {
  ...dtoSchemas,
  ...customSchemas,
};

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
      schemas,
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
