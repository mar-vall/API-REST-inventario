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
            statusCode: { type: "number", example: 400 },
            message: { type: "string", example: "Insufficient stock" },
            error: { type: "string", example: "Bad Request" },
          },
        },
      },
    },
  },
  apis: ["./src/routes/*.ts"],
};

export const swaggerSpec = swaggerJsdoc(options);
