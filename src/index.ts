#!/usr/bin/env node

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';
import { PluralsightAPI, PluralsightConfig } from './pluralsight-api.js';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

class PluralsightMCPServer {
  private server: Server;
  private pluralsightAPI: PluralsightAPI;

  constructor() {
    this.server = new Server({
      name: 'pluralsight-mcp-server',
      version: '1.0.0',
    });

    // Initialize Pluralsight API
    const config: PluralsightConfig = {
      apiKey: process.env.PLURALSIGHT_API_KEY || '',
      baseUrl: process.env.PLURALSIGHT_BASE_URL || 'https://app.pluralsight.com/api',
    };

    this.pluralsightAPI = new PluralsightAPI(config);

    this.setupHandlers();
  }

  private setupHandlers() {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      return {
        tools: [
          {
            name: 'search_courses',
            description: 'Search for Pluralsight courses by query and optional filters',
            inputSchema: {
              type: 'object',
              properties: {
                query: {
                  type: 'string',
                  description: 'Search query for courses',
                },
                level: {
                  type: 'string',
                  description: 'Course difficulty level (Beginner, Intermediate, Advanced)',
                  enum: ['Beginner', 'Intermediate', 'Advanced'],
                },
                skillPath: {
                  type: 'string',
                  description: 'Skill path to filter by',
                },
                tag: {
                  type: 'string',
                  description: 'Tag to filter by',
                },
              },
              required: ['query'],
            },
          },
          {
            name: 'get_course',
            description: 'Get detailed information about a specific course',
            inputSchema: {
              type: 'object',
              properties: {
                courseId: {
                  type: 'string',
                  description: 'The ID of the course to retrieve',
                },
              },
              required: ['courseId'],
            },
          },
          {
            name: 'get_learning_paths',
            description: 'Get available learning paths',
            inputSchema: {
              type: 'object',
              properties: {},
            },
          },
          {
            name: 'get_user_progress',
            description: 'Get user progress for courses',
            inputSchema: {
              type: 'object',
              properties: {
                userId: {
                  type: 'string',
                  description: 'The ID of the user',
                },
              },
              required: ['userId'],
            },
          },
          {
            name: 'get_skill_assessment',
            description: 'Get skill assessment information and recommendations',
            inputSchema: {
              type: 'object',
              properties: {
                skillName: {
                  type: 'string',
                  description: 'Name of the skill to assess',
                },
              },
              required: ['skillName'],
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
          case 'search_courses':
            return await this.handleSearchCourses(args);
          case 'get_course':
            return await this.handleGetCourse(args);
          case 'get_learning_paths':
            return await this.handleGetLearningPaths(args);
          case 'get_user_progress':
            return await this.handleGetUserProgress(args);
          case 'get_skill_assessment':
            return await this.handleGetSkillAssessment(args);
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

  private async handleSearchCourses(args: any) {
    const { query, level, skillPath, tag } = args;
    const courses = await this.pluralsightAPI.searchCourses(query, {
      level,
      skillPath,
      tag,
    });

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(courses, null, 2),
        },
      ],
    };
  }

  private async handleGetCourse(args: any) {
    const { courseId } = args;
    const course = await this.pluralsightAPI.getCourse(courseId);

    return {
      content: [
        {
          type: 'text',
          text: course ? JSON.stringify(course, null, 2) : 'Course not found',
        },
      ],
    };
  }

  private async handleGetLearningPaths(args: any) {
    const learningPaths = await this.pluralsightAPI.getLearningPaths();

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(learningPaths, null, 2),
        },
      ],
    };
  }

  private async handleGetUserProgress(args: any) {
    const { userId } = args;
    const progress = await this.pluralsightAPI.getUserProgress(userId);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(progress, null, 2),
        },
      ],
    };
  }

  private async handleGetSkillAssessment(args: any) {
    const { skillName } = args;
    const assessment = await this.pluralsightAPI.getSkillAssessment(skillName);

    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify(assessment, null, 2),
        },
      ],
    };
  }

  async run() {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    console.error('Pluralsight MCP server running on stdio');
  }
}

// Start the server
const server = new PluralsightMCPServer();
server.run().catch(console.error);