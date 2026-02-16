# Ansible Role: edu-sharing-alfresco-webscripts

The `edu-sharing-alfresco-webscripts` role is responsible for managing custom Alfresco webscripts. This role handles the complete lifecycle of webscripts including cleanup, deployment, and reloading in the Alfresco repository service.

## Implementation

The `edu-sharing-alfresco-webscripts` role is included in the playbook [system.yml](../../../system.yml).

```yaml
- hosts: edusharing
  roles:
    - role: edu-sharing-alfresco-webscripts
      tags: 
        - edu-sharing-alfresco-webscripts

```

To run only the `edu-sharing-alfresco-webscripts` role:

```sh
ansible-playbook -v -i <host> ansible/system.yml --tags "edu-sharing-alfresco-webscripts"
```
This will skip other roles and run only the edu-sharing-alfresco-webscripts role.


## Role Variables

The `edu-sharing-alfresco-webscripts` role allows you to customize variables according to your requirements. 

Here are the default variables:

```yaml
---
# Default variables for edu-sharing-alfresco-webscripts role

alfresco_webscripts_url: "{{ edu_sharing_protocol | default('http') }}://{{ edu_sharing_host }}/alfresco/service/index"

# List of webscripts to deploy
# Each item can have:
#   - src: A single file, folder, or array of files
#   - dest: Optional destination path inside the webscripts volume (relative to volume root)
#           If not specified, files are copied to the root of the webscripts volume

webscripts_to_deploy: []
  # Example: Single file
  # - src: "files/webscripts/login.get.desc.xml"
  #   dest: "login"  # Optional: will be placed in {{ repository_service_volume_webscripts }}/login/

  # Example: Folder containing multiple webscripts
  # - src: "files/webscripts/search-script"
  #   dest: "search-script"  # Optional: entire folder copied to this destination

  # Example: Multiple individual files
  # - src:
  #     - "files/webscripts/script1.json.ftl"
  #     - "files/webscripts/script1.get.desc.xml"
  #     - "files/webscripts/script1.get.js"
  #   dest: "custom/script1"  # Optional: all files copied to this destination

  # Example: File without destination (goes to root)
  # - src: "files/webscripts/global-script.get.desc.xml"
  #   # No dest - will be copied to {{ repository_service_volume_webscripts }}/
```

### Variable Description

#### `alfresco_webscripts_url`
- **Default**: `{{ edu_sharing_protocol | default('http') }}://{{ edu_sharing_host }}/alfresco/service/index`
- **Description**: The URL endpoint used to reload and register webscripts in Alfresco. This endpoint accepts POST requests with `reset=on` parameter to trigger a full webscripts reload.
- **Usage**: Internal variable used for webscripts registration. Automatically constructed from `edu_sharing_protocol` and `edu_sharing_host`.

#### `webscripts_to_deploy`
- **Default**: `[]` (empty list)
- **Description**: List of webscripts to deploy to the Alfresco repository. Each item can contain single files, folders, or multiple files with optional destination paths.
- **Structure**: Each item in the list should have:
  - `src` (required): Source file(s) or folder to deploy (string or list of strings)
  - `dest` (optional): Destination path relative to the webscripts volume root. If not specified, files are copied to the root of the webscripts volume.

**Examples**:

Single file deployment:
```yaml
webscripts_to_deploy:
  - src: "files/webscripts/login.get.desc.xml"
    dest: "login"
```

Entire folder deployment:
```yaml
webscripts_to_deploy:
  - src: "files/webscripts/search-script"
    dest: "search-script"
```

Multiple files to same destination:
```yaml
webscripts_to_deploy:
  - src:
      - "files/webscripts/script1.json.ftl"
      - "files/webscripts/script1.get.desc.xml"
      - "files/webscripts/script1.get.js"
    dest: "custom/script1"
```

File without destination (goes to root):
```yaml
webscripts_to_deploy:
  - src: "files/webscripts/global-script.get.desc.xml"
```

## Tasks

The `tasks/` directory contains all the ansible tasks.

- `main.yml`: The main entry task for ansible.
- `cleanup_webscripts.yml`: Finds and removes all existing webscripts content from the volume and reloads Alfresco.
- `deploy_webscript.yml`: Copies new webscripts to the designated locations.
- `register_webscripts.yml`: Reloads and registers all webscripts in Alfresco.

## Examples

### Basic Configuration

```yaml
webscripts_to_deploy:
  - src: "files/org/twillo/institution"
    dest: "org/twillo/institution"
```

### Multiple Webscripts Deployment

```yaml
webscripts_to_deploy:
  # Custom institutional webscripts
  - src: "files/org/twillo/institution"
    dest: "org/twillo/institution"
  
  # Search enhancement webscripts
  - src:
      - "files/webscripts/search.get.desc.xml"
      - "files/webscripts/search.get.js"
      - "files/webscripts/search.get.json.ftl"
    dest: "api/search"
  
  # Global utility scripts
  - src: "files/webscripts/utils"
    dest: "utils"
```
