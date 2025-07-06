#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { ChildrenAPI, ChildrenApiConfig, AgeCategory } from './children-api.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class ChildrenActivityMCPServer {
  private server: Server;
  private childrenAPI: ChildrenAPI;

  constructor() {
    this.server = new Server({
      name: 'children-activity-mcp-server',
      version: '1.0.0',
    });

    // Initialize Children API
    const config: ChildrenApiConfig = {
      apiKey: process.env.CHILDREN_API_KEY || '',
      baseUrl: process.env.CHILDREN_BASE_URL || 'https://api.children-activities.com/v1',
    };

    this.childrenAPI = new ChildrenAPI(config);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'register_parent',
            description: 'Register a new parent in the system',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Parent full name',
                },
                email: {
                  type: 'string',
                  description: 'Parent email address',
                },
                phone: {
                  type: 'string',
                  description: 'Parent phone number',
                },
              },
              required: ['name', 'email', 'phone'],
            },
          },
          {
            name: 'register_child',
            description: 'Register a new child for a parent',
            inputSchema: {
              type: 'object',
              properties: {
                name: {
                  type: 'string',
                  description: 'Child full name',
                },
                age: {
                  type: 'number',
                  description: 'Child age (must be between 5-10)',
                  minimum: 5,
                  maximum: 10,
                },
                parentId: {
                  type: 'string',
                  description: 'Parent ID',
                },
              },
              required: ['name', 'age', 'parentId'],
            },
          },
          {
            name: 'get_parent',
            description: 'Get parent information by ID',
            inputSchema: {
              type: 'object',
              properties: {
                parentId: {
                  type: 'string',
                  description: 'The ID of the parent to retrieve',
                },
              },
              required: ['parentId'],
            },
          },
          {
            name: 'get_child',
            description: 'Get child information by ID',
            inputSchema: {
              type: 'object',
              properties: {
                childId: {
                  type: 'string',
                  description: 'The ID of the child to retrieve',
                },
              },
              required: ['childId'],
            },
          },
          {
            name: 'get_activities',
            description: 'Get available activities, optionally filtered by age category',
            inputSchema: {
              type: 'object',
              properties: {
                ageCategory: {
                  type: 'string',
                  description: 'Age category to filter by',
                  enum: ['5-6', '7-8', '9-10'],
                },
              },
            },
          },
          {
            name: 'start_session',
            description: 'Start a new activity session for a child',
            inputSchema: {
              type: 'object',
              properties: {
                childId: {
                  type: 'string',
                  description: 'The ID of the child',
                },
                activityId: {
                  type: 'string',
                  description: 'The ID of the activity',
                },
              },
              required: ['childId', 'activityId'],
            },
          },
          {
            name: 'end_session',
            description: 'End an active activity session',
            inputSchema: {
              type: 'object',
              properties: {
                sessionId: {
                  type: 'string',
                  description: 'The ID of the session to end',
                },
                notes: {
                  type: 'string',
                  description: 'Optional notes about the session',
                },
              },
              required: ['sessionId'],
            },
          },
          {
            name: 'get_child_sessions',
            description: 'Get all sessions for a specific child',
            inputSchema: {
              type: 'object',
              properties: {
                childId: {
                  type: 'string',
                  description: 'The ID of the child',
                },
              },
              required: ['childId'],
            },
          },
          {
            name: 'get_parent_children',
            description: 'Get all children for a specific parent',
            inputSchema: {
              type: 'object',
              properties: {
                parentId: {
                  type: 'string',
                  description: 'The ID of the parent',
                },
              },
              required: ['parentId'],
            },
          },
        ],
      };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;

      try {
        switch (name) {
          case 'register_parent':
            return await this.handleRegisterParent(args);
          case 'register_child':
            return await this.handleRegisterChild(args);
          case 'get_parent':
            return await this.handleGetParent(args);
          case 'get_child':
            return await this.handleGetChild(args);
          case 'get_activities':
            return await this.handleGetActivities(args);
          case 'start_session':
            return await this.handleStartSession(args);
          case 'end_session':
            return await this.handleEndSession(args);
          case 'get_child_sessions':
            return await this.handleGetChildSessions(args);
          case 'get_parent_children':
            return await this.handleGetParentChildren(args);
          default:
            throw new Error(`Unknown tool: ${name}`);
        }
      } catch (error) {
        return {
          content: [
            {
              type: 'text',
              text: `Error: ${error instanceof Error ? error.message : 'Unknown error'}`,
            },
          ],
        };
      }
    });
  }

  private async handleRegisterParent(args: any) {
    const { name, email, phone } = args;
    const parent = await this.childrenAPI.registerParent({ name, email, phone });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(parent, null, 2),
        },
      ],
    };
  }

  private async handleRegisterChild(args: any) {
    const { name, age, parentId } = args;
    const child = await this.childrenAPI.registerChild({ name, age, parentId });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(child, null, 2),
        },
      ],
    };
  }

  private async handleGetParent(args: any) {
    const { parentId } = args;
    const parent = await this.childrenAPI.getParentById(parentId);

    return {
      content: [
        {
          type: 'text',
          text: parent ? JSON.stringify(parent, null, 2) : 'Parent not found',
        },
      ],
    };
  }

  private async handleGetChild(args: any) {
    const { childId } = args;
    const child = await this.childrenAPI.getChildById(childId);

    return {
      content: [
        {
          type: 'text',
          text: child ? JSON.stringify(child, null, 2) : 'Child not found',
        },
      ],
    };
  }

  private async handleGetActivities(args: any) {
    const { ageCategory } = args;
    let activities;
    
    if (ageCategory) {
      activities = await this.childrenAPI.getActivitiesByAgeCategory(ageCategory as AgeCategory);
    } else {
      activities = await this.childrenAPI.getAllActivities();
    }

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(activities, null, 2),
        },
      ],
    };
  }

  private async handleStartSession(args: any) {
    const { childId, activityId } = args;
    const session = await this.childrenAPI.startSession(childId, activityId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(session, null, 2),
        },
      ],
    };
  }

  private async handleEndSession(args: any) {
    const { sessionId, notes } = args;
    const session = await this.childrenAPI.endSession(sessionId, notes);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(session, null, 2),
        },
      ],
    };
  }

  private async handleGetChildSessions(args: any) {
    const { childId } = args;
    const sessions = await this.childrenAPI.getChildSessions(childId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(sessions, null, 2),
        },
      ],
    };
  }

  private async handleGetParentChildren(args: any) {
    const { parentId } = args;
    const children = await this.childrenAPI.getParentChildren(parentId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(children, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Children Activity MCP server running on stdio');
  }
}

// Start the server
const server = new ChildrenActivityMCPServer();
server.run().catch(console.error);