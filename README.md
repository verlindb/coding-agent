# Children Activity MCP Server

A Model Context Protocol (MCP) server that provides integration for managing children's activities with parent registration and age-based categorization (5-6, 7-8, 9-10 years).

## Features

- **Parent Registration**: Register parents with contact information
- **Child Registration**: Register children with age-based categorization
- **Age-Based Activities**: Activities categorized by age groups (5-6, 7-8, 9-10)
- **Session Management**: Start and end activity sessions with tracking
- **Running Context**: Track active sessions and progress
- **Activity Types**: Support for running, sports, games, and exercise activities
- **Containerized**: Fully containerized for easy deployment with Docker or Podman

## Available Tools

### `register_parent`
Register a new parent in the system.

**Parameters:**
- `name` (required): Parent full name
- `email` (required): Parent email address
- `phone` (required): Parent phone number

### `register_child`
Register a new child for a parent.

**Parameters:**
- `name` (required): Child full name
- `age` (required): Child age (must be between 5-10)
- `parentId` (required): Parent ID

### `get_parent`
Get parent information by ID.

**Parameters:**
- `parentId` (required): The ID of the parent to retrieve

### `get_child`
Get child information by ID.

**Parameters:**
- `childId` (required): The ID of the child to retrieve

### `get_activities`
Get available activities, optionally filtered by age category.

**Parameters:**
- `ageCategory` (optional): Age category to filter by (5-6, 7-8, 9-10)

### `start_session`
Start a new activity session for a child.

**Parameters:**
- `childId` (required): The ID of the child
- `activityId` (required): The ID of the activity

### `end_session`
End an active activity session.

**Parameters:**
- `sessionId` (required): The ID of the session to end
- `notes` (optional): Optional notes about the session

### `get_child_sessions`
Get all sessions for a specific child.

**Parameters:**
- `childId` (required): The ID of the child

### `get_parent_children`
Get all children for a specific parent.

**Parameters:**
- `parentId` (required): The ID of the parent

## Setup

### Prerequisites

- Node.js 18+ (for local development)
- Docker and Docker Compose OR Podman and Podman Compose (for containerized deployment)

### Environment Variables

The server requires environment variables for API configuration:

```bash
# Optional: Set custom API configuration
CHILDREN_API_KEY=your_api_key_here
CHILDREN_BASE_URL=https://api.children-activities.com/v1
```

## Installation & Usage

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Build the project:
```bash
npm run build
```

3. Run the server:
```bash
npm start
```

4. For development with auto-reload:
```bash
npm run dev
```

### Container Deployment

#### Docker Deployment

1. Build and run with Docker Compose:
```bash
docker-compose up --build
```

2. Run in detached mode:
```bash
docker-compose up -d --build
```

3. View logs:
```bash
docker-compose logs -f
```

4. Stop the service:
```bash
docker-compose down
```

#### Podman Deployment

1. Build and run with Podman Compose:
```bash
podman-compose up --build
```

2. Run in detached mode:
```bash
podman-compose up -d --build
```

3. View logs:
```bash
podman-compose logs -f
```

4. Stop the service:
```bash
podman-compose down
```

### Manual Container Build

#### Docker Manual Build

```bash
# Build the container
docker build -t children-activity-mcp-server .

# Run the container
docker run -p 3000:3000 children-activity-mcp-server
```

#### Podman Manual Build

```bash
# Build the container
podman build -t children-activity-mcp-server .

# Run the container
podman run -p 3000:3000 children-activity-mcp-server
```

### Podman Compatibility Notes

This project is fully compatible with Podman as a Docker alternative. Podman can use the same `docker-compose.yml` file and Dockerfile without modification. 

**To check if Podman is available on your system:**
```bash
podman --version
podman-compose --version
```

**Or use the provided script to check both Docker and Podman availability:**
```bash
./check-container-runtime.sh
```

**To test container build compatibility:**
```bash
./test-container-build.sh
```

For systems where `podman-compose` is not available, you can also use:
- `podman play kube` with Kubernetes YAML files
- Regular `podman run` commands as shown in the manual build section above

**Troubleshooting Podman Issues:**
- If you encounter permission issues, try running with `--cgroup-manager=cgroupfs`
- For rootless operation, ensure proper user session setup: `loginctl enable-linger $USER`
- On some systems, you may need to alias `docker` to `podman` or install `podman-docker` package for full compatibility

**Note:** On some systems, you may need to alias `docker` to `podman` or install `podman-docker` package for full compatibility with existing Docker workflows.

## MCP Client Integration

This server implements the Model Context Protocol and can be used with any MCP-compatible client. The server communicates via stdio by default.

### Example Client Configuration

For Claude Desktop or other MCP clients, add this server to your configuration:

```json
{
  "mcpServers": {
    "children-activity": {
      "command": "node",
      "args": ["/path/to/children-activity-mcp-server/dist/index.js"],
      "env": {
        "CHILDREN_API_KEY": "your_api_key_here"
      }
    }
  }
}
```

## API Integration

The server includes mock data that allows testing all functionality without requiring actual API access. In a production environment, you would configure the API endpoints to connect to your actual children's activity management backend.

## Age Categories

The system supports three age categories:
- **5-6 years**: Fun activities focused on play and basic movement
- **7-8 years**: More structured activities with skill development
- **9-10 years**: Advanced activities with competitive elements

## Development

### Project Structure

```
src/
├── index.ts              # Main MCP server implementation
├── children-api.ts       # Children API client wrapper
├── pluralsight-api.ts    # Legacy file (to be removed)
dist/                     # Compiled JavaScript output
docker-compose.yml        # Docker Compose configuration
Dockerfile               # Container definition
package.json             # Node.js project configuration
tsconfig.json           # TypeScript configuration
```

### Adding New Tools

To add new MCP tools:

1. Add the tool definition in the `ListToolsRequestSchema` handler
2. Add the corresponding handler method
3. Implement the API integration in `children-api.ts`
4. Update this documentation

### Testing

The server includes mock data that allows testing all functionality without requiring actual API access:

```bash
# Test the build
npm run build

# Test the server (should start without errors)
npm start
```

## License

MIT

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request