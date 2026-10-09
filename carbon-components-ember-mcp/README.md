# carbon-components-ember-mcp

Gives your AI coding agent the docs for [carbon-components-ember](https://github.com/IBM/carbon-components-ember), in the version your app has installed. For each component, the agent can read its description, how to import it, its arguments and blocks, and example usage from its stories.

It's an [MCP](https://modelcontextprotocol.io/) server that talks over stdio. It offers the same docs tools as the MCP endpoint of carbon-components-ember's Storybook.

## Set up

Add it to your agent from your app's directory, the one where carbon-components-ember is installed.

**Claude Code**

```sh
claude mcp add carbon-components-ember -- npx -y carbon-components-ember-mcp
```

**VS Code** (GitHub Copilot), in `.vscode/mcp.json`:

```json
{
  "servers": {
    "carbon-components-ember": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "carbon-components-ember-mcp"]
    }
  }
}
```

**Cursor**, in `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "carbon-components-ember": {
      "command": "npx",
      "args": ["-y", "carbon-components-ember-mcp"]
    }
  }
}
```

Other agents take the same command: `npx -y carbon-components-ember-mcp`.

## Tools

| Tool              | What it returns                                                              |
| ----------------- | ---------------------------------------------------------------------------- |
| `docs-list`       | Every component, with its ID and a summary                                   |
| `docs-show`       | One component: its description, import, arguments, blocks and story examples |
| `docs-show-story` | One story's example code                                                     |

## Instructions for your agent

When an agent connects, the server sends it [instructions](https://github.com/IBM/carbon-components-ember/blob/main/carbon-components-ember-mcp/instructions.md) for using the components: to look each one up before using it and type-check the result with Glint, how templates and icons work, and how Carbon React's props map onto arguments. Agents that support MCP server instructions, such as Claude Code, add them to their context.

To give every agent on your app these instructions, whether or not it uses the server, copy them into your `AGENTS.md`, `CLAUDE.md` or `.github/copilot-instructions.md`.

## Which docs it serves

The server starts in your agent's working directory. It looks for `node_modules/carbon-components-ember` there and in each parent directory, and serves the docs published with that release: `https://ibm.github.io/carbon-components-ember/versions/v<version>-carbon-components-ember/`.

If that release has no published docs, or carbon-components-ember isn't installed, the server falls back to the docs for the `main` branch and says so on stderr.

| Option                   | Use                                                                                              |
| ------------------------ | ------------------------------------------------------------------------------------------------ |
| `--release <version>`    | Serve this release's docs, whatever is installed                                                 |
| `--manifests <url\|dir>` | Read the docs from a running Storybook (e.g. `http://localhost:6006`) or a built one's directory |
