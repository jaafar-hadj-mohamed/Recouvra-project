// OpenAPI v3 spec for the Billing API
export const specs = {
  openapi: '3.0.0',
  info: {
    title: 'Billing API',
    version: '1.0.0',
    description: 'REST API for managing users, clients, invoices, payments, actions and stats.'
  },
  servers: [
    { url: 'http://localhost:3000', description: 'Local development server' }
  ],
  components: {
    securitySchemes: {
      BearerAuth: {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT'
      }
    },
    schemas: {
      User: {
        type: 'object',
        properties: {
          id: { type: 'string', example: '60f7f0d2c2a1a2b7c8d9e123' },
          name: { type: 'string', example: 'Jean Dupont' },
          email: { type: 'string', example: 'jean@example.com' },
          role: { type: 'string', enum: ['agent', 'manager', 'admin'], example: 'admin' }
        },
        required: ['id', 'name', 'email', 'role']
      },
      Client: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          name: { type: 'string' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' }
        }
      },
      Invoice: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          client: { type: 'string' },
          amount: { type: 'number' },
          dueDate: { type: 'string', format: 'date' },
          status: { type: 'string', enum: ['unpaid', 'partial', 'paid'] },
          payments: { type: 'array', items: { type: 'string' } }
        }
      },
      Payment: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          invoice: { type: 'string' },
          amount: { type: 'number' },
          date: { type: 'string', format: 'date-time' },
          method: { type: 'string' }
        }
      },
      CollectionAction: {
        type: 'object',
        properties: {
          id: { type: 'string' },
          client: { type: 'string' },
          type: { type: 'string' },
          note: { type: 'string' },
          date: { type: 'string', format: 'date-time' },
          agent: { type: 'string' }
        }
      }
    }
  },
  paths: {
    '/api/auth/login': {
      post: {
        tags: ['Auth'],
        summary: 'Login user',
        requestBody: {
          required: true,
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  email: { type: 'string' },
                  password: { type: 'string' }
                },
                required: ['email', 'password']
              }
            }
          }
        },
        responses: {
          '200': {
            description: 'JWT token and user',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    token: { type: 'string' },
                    user: { $ref: '#/components/schemas/User' }
                  }
                }
              }
            }
          },
          '401': { description: 'Unauthorized' }
        }
      }
    },
    '/api/users': {
      post: {
        tags: ['Users'],
        summary: 'Create user',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/User' } } } },
        responses: { '201': { description: 'Created' } }
      },
      get: {
        tags: ['Users'],
        summary: 'List users',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'array',
                  items: { $ref: '#/components/schemas/User' }
                }
              }
            }
          }
        }
      }
    },
    '/api/clients': {
      post: {
        tags: ['Clients'],
        summary: 'Create client',
        requestBody: { required: true, content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } } },
        responses: { '201': { description: 'Created' } }
      },
      get: {
        tags: ['Clients'],
        summary: 'List clients',
        responses: {
          '200': {
            description: 'OK',
            content: {
              'application/json': {
                schema: {
                  type: 'object',
                  properties: {
                    total: { type: 'number' },
                    page: { type: 'number' },
                    limit: { type: 'number' },
                    data: { type: 'array', items: { $ref: '#/components/schemas/Client' } }
                  }
                }
              }
            }
          }
        }
      }
    },
    '/api/clients/{id}': {
      get: {
        tags: ['Clients'],
        summary: 'Get client',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '200': { description: 'OK', content: { 'application/json': { schema: { $ref: '#/components/schemas/Client' } } } } }
      },
      put: {
        tags: ['Clients'],
        summary: 'Update client',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK' } }
      },
      delete: {
        tags: ['Clients'],
        summary: 'Delete client',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        responses: { '204': { description: 'No Content' } }
      }
    },
    '/api/invoices': {
      post: {
        tags: ['Invoices'],
        summary: 'Create invoice',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { client: { type: 'string' }, amount: { type: 'number' }, dueDate: { type: 'string', format: 'date' }, status: { type: 'string' } }, required: ['client','amount','dueDate'] } } } },
        responses: { '201': { description: 'Created' } }
      },
      get: {
        tags: ['Invoices'],
        summary: 'List invoices',
        parameters: [ { name: 'page', in: 'query', schema: { type: 'integer' } }, { name: 'limit', in: 'query', schema: { type: 'integer' } }, { name: 'status', in: 'query', schema: { type: 'string' } } ],
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { total: { type: 'number' }, page: { type: 'number' }, limit: { type: 'number' }, data: { type: 'array', items: { $ref: '#/components/schemas/Invoice' } } } } } }
          }
        }
      }
    },
    '/api/invoices/{id}': {
      put: {
        tags: ['Invoices'],
        summary: 'Update invoice',
        parameters: [{ name: 'id', in: 'path', required: true, schema: { type: 'string' } }],
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object' } } } },
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api/payments': {
      post: {
        tags: ['Payments'],
        summary: 'Create payment',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { invoice: { type: 'string' }, amount: { type: 'number' }, date: { type: 'string', format: 'date-time' }, method: { type: 'string' } }, required: ['invoice','amount'] } } } },
        responses: { '201': { description: 'Created' } }
      }
    },
    '/api/actions': {
      post: {
        tags: ['Actions'],
        summary: 'Create action',
        requestBody: { required: true, content: { 'application/json': { schema: { type: 'object', properties: { client: { type: 'string' }, type: { type: 'string' }, note: { type: 'string' }, date: { type: 'string', format: 'date-time' } }, required: ['client','type'] } } } },
        responses: { '201': { description: 'Created' } }
      },
      get: {
        tags: ['Actions'],
        summary: 'List actions',
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'array', items: { $ref: '#/components/schemas/CollectionAction' } } } }
          }
        }
      }
    },
    '/api/stats': {
      get: {
        tags: ['Stats'],
        summary: 'Get statistics',
        responses: {
          '200': {
            description: 'OK',
            content: { 'application/json': { schema: { type: 'object', properties: { totalInvoices: { type: 'number' }, totalUnpaidAmount: { type: 'number' }, totalCollectedAmount: { type: 'number' }, totalClients: { type: 'number' } } } } }
          }
        }
      }
    },
    '/health': {
      get: {
        tags: ['Health'],
        summary: 'Health check',
        responses: { '200': { description: 'OK' } }
      }
    },
    '/api': {
      get: {
        tags: ['Health'],
        summary: 'API root health',
        responses: { '200': { description: 'OK' } }
      }
    }
  }
}
