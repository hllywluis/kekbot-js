# Ansible Deployment for Kekbot

This directory contains Ansible configuration for deploying the Discord bot to a server.

## Prerequisites

1. Ansible must be installed on your local machine. Install it with:

   ```bash
   # On macOS
   brew install ansible

   # On Ubuntu/Debian
   sudo apt-get install ansible
   ```

2. Make sure your `.env` file contains all necessary Discord bot tokens and configuration.

## Files

- `playbook.yml`: Contains all the deployment tasks including:
  - Installing Node.js and npm
  - Setting up the application directory
  - Installing dependencies
  - Creating and managing a systemd service
  - Deploying Discord bot commands
  
- `inventory.ini`: Contains the server connection details

## Deployment

To deploy the bot, run:

```bash
ansible-playbook -i inventory.ini playbook.yml
```

## Service Management

After deployment, you can manage the bot service on the server using:

```bash
# Check status
sudo systemctl status kekbot

# Stop the bot
sudo systemctl stop kekbot

# Start the bot
sudo systemctl start kekbot

# View logs
sudo journalctl -u kekbot
```

## Troubleshooting

1. If the deployment fails due to SSH connection issues:
   - Verify that you can SSH into the server manually
   - Check that the server details in `inventory.ini` are correct

2. If the bot fails to start:
   - Check the logs using `sudo journalctl -u kekbot`
   - Verify that the `.env` file was properly copied and contains valid tokens
