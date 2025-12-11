#!/bin/bash

# Local deployment and testing script for Tax Declaration App

set -e

echo "🚀 Tax Declaration - Local Build & Test Script"
echo "=============================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if required tools are installed
check_requirements() {
    echo -e "\n${YELLOW}Checking requirements...${NC}"

    if ! command -v docker &> /dev/null; then
        echo -e "${RED}❌ Docker is not installed${NC}"
        exit 1
    fi

    if ! command -v pnpm &> /dev/null; then
        echo -e "${RED}❌ pnpm is not installed${NC}"
        echo "Install it with: npm install -g pnpm"
        exit 1
    fi

    echo -e "${GREEN}✅ All requirements met${NC}"
}

# Build the application
build_app() {
    echo -e "\n${YELLOW}Building Next.js application...${NC}"
    pnpm install
    pnpm build
    echo -e "${GREEN}✅ Build successful${NC}"
}

# Build Docker image
build_docker() {
    echo -e "\n${YELLOW}Building Docker image...${NC}"
    docker build -t tax-declaration-app:latest .
    echo -e "${GREEN}✅ Docker image built${NC}"
}

# Run Docker container
run_docker() {
    echo -e "\n${YELLOW}Starting Docker container...${NC}"

    # Stop existing container if running
    docker stop tax-declaration-app 2>/dev/null || true
    docker rm tax-declaration-app 2>/dev/null || true

    # Run container
    docker run -d \
        --name tax-declaration-app \
        -p 3000:3000 \
        tax-declaration-app:latest

    echo -e "${GREEN}✅ Container started${NC}"
    echo -e "${GREEN}🌐 Application running at: http://localhost:3000${NC}"
}

# Run Terraform plan
terraform_plan() {
    echo -e "\n${YELLOW}Running Terraform plan...${NC}"

    if [ ! -f "terraform/terraform.tfvars" ]; then
        echo -e "${RED}❌ terraform/terraform.tfvars not found${NC}"
        echo "Copy terraform/terraform.tfvars.example to terraform/terraform.tfvars and fill in your values"
        exit 1
    fi

    cd terraform
    terraform init
    terraform plan
    cd ..

    echo -e "${GREEN}✅ Terraform plan complete${NC}"
}

# Show logs
show_logs() {
    echo -e "\n${YELLOW}Showing container logs...${NC}"
    docker logs -f tax-declaration-app
}

# Stop container
stop_container() {
    echo -e "\n${YELLOW}Stopping container...${NC}"
    docker stop tax-declaration-app 2>/dev/null || true
    docker rm tax-declaration-app 2>/dev/null || true
    echo -e "${GREEN}✅ Container stopped${NC}"
}

# Main menu
show_menu() {
    echo -e "\n${YELLOW}What would you like to do?${NC}"
    echo "1) Build Next.js application"
    echo "2) Build Docker image"
    echo "3) Run Docker container"
    echo "4) Build and run (full local deployment)"
    echo "5) Show container logs"
    echo "6) Stop container"
    echo "7) Run Terraform plan"
    echo "8) Exit"
    echo ""
    read -p "Enter your choice [1-8]: " choice

    case $choice in
        1)
            check_requirements
            build_app
            show_menu
            ;;
        2)
            check_requirements
            build_docker
            show_menu
            ;;
        3)
            check_requirements
            run_docker
            show_menu
            ;;
        4)
            check_requirements
            build_app
            build_docker
            run_docker
            show_menu
            ;;
        5)
            show_logs
            ;;
        6)
            stop_container
            show_menu
            ;;
        7)
            terraform_plan
            show_menu
            ;;
        8)
            echo -e "${GREEN}👋 Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option${NC}"
            show_menu
            ;;
    esac
}

# Start script
if [ "$1" == "run" ]; then
    check_requirements
    build_app
    build_docker
    run_docker
elif [ "$1" == "stop" ]; then
    stop_container
elif [ "$1" == "logs" ]; then
    show_logs
else
    show_menu
fi

