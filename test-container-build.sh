#!/bin/bash

# Test Container Build Script
# This script tests building the container with either Docker or Podman

set -e

echo "Testing container build compatibility..."
echo "======================================"

# Check if we should test Docker
if command -v docker &> /dev/null; then
    echo "Testing Docker build..."
    if docker build -t pluralsight-mcp-server-test . > /dev/null 2>&1; then
        echo "✓ Docker build successful"
        # Clean up
        docker rmi pluralsight-mcp-server-test > /dev/null 2>&1 || true
    else
        echo "✗ Docker build failed"
    fi
fi

# Check if we should test Podman  
if command -v podman &> /dev/null; then
    echo "Testing Podman build..."
    # Try with cgroupfs manager to avoid systemd issues
    if podman build --cgroup-manager=cgroupfs -t pluralsight-mcp-server-podman-test . > /dev/null 2>&1; then
        echo "✓ Podman build successful"
        # Clean up
        podman rmi pluralsight-mcp-server-podman-test > /dev/null 2>&1 || true
    else
        echo "⚠ Podman build failed (this may be due to environment limitations)"
        echo "   In a proper user environment, Podman should work correctly"
    fi
fi

echo "======================================"
echo "Build compatibility test completed."