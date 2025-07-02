#!/bin/bash

# Check Container Runtime Availability
# This script helps determine whether Docker or Podman is available on your system

echo "Checking container runtime availability..."
echo "========================================"

# Check Docker
if command -v docker &> /dev/null; then
    echo "✓ Docker is available"
    echo "  Version: $(docker --version)"
    
    if command -v docker-compose &> /dev/null; then
        echo "✓ Docker Compose is available"
        echo "  Version: $(docker-compose --version)"
        echo "  → You can use: docker-compose up --build"
    else
        echo "✗ Docker Compose is not available"
        echo "  → You can still use: docker build and docker run commands"
    fi
else
    echo "✗ Docker is not available"
fi

echo ""

# Check Podman
if command -v podman &> /dev/null; then
    echo "✓ Podman is available"
    echo "  Version: $(podman --version)"
    
    if command -v podman-compose &> /dev/null; then
        echo "✓ Podman Compose is available"
        echo "  Version: $(podman-compose --version)"
        echo "  → You can use: podman-compose up --build"
    else
        echo "✗ Podman Compose is not available"
        echo "  → You can still use: podman build and podman run commands"
    fi
else
    echo "✗ Podman is not available"
fi

echo ""
echo "========================================"

# Provide recommendations
if command -v docker &> /dev/null && command -v docker-compose &> /dev/null; then
    echo "Recommendation: Use Docker (fully available)"
elif command -v podman &> /dev/null && command -v podman-compose &> /dev/null; then
    echo "Recommendation: Use Podman (fully available)"
elif command -v docker &> /dev/null; then
    echo "Recommendation: Use Docker with manual commands"
elif command -v podman &> /dev/null; then
    echo "Recommendation: Use Podman with manual commands"
else
    echo "⚠️  Neither Docker nor Podman is available. Please install one of them."
    echo "   Docker: https://docs.docker.com/get-docker/"
    echo "   Podman: https://podman.io/getting-started/installation"
fi

echo ""
echo "Note: This script only checks availability. Some environments may have"
echo "      additional configuration requirements for containerized execution."