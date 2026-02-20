// Auto-generated typed client (Layer 2)
// Wraps RPC layer and unwraps PlexusStreamItem to domain types

import type { RpcClient } from '../rpc';
import { extractData, collectOne } from '../rpc';
import type { HyperforgeEvent } from './types';

/** Typed client interface for hyperforge plugin */
export interface HyperforgeClient {
  /** Set SSH key for an organization */
  configSetSshKey(org: string, sshKey: string): AsyncGenerator<HyperforgeEvent>;
  /** Show organization configuration */
  configShow(org: string): AsyncGenerator<HyperforgeEvent>;
  /** Initialize hyperforge for a git repository */
  gitInit(forges: string, org: string, path: string, description?: string | null, dryRun?: boolean | null, force?: boolean | null, repoName?: string | null, sshKeys?: string | null, visibility?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Push to configured forges */
  gitPush(path: string, dryRun?: boolean | null, force?: boolean | null, onlyForges?: string | null, setUpstream?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Show git repository status */
  gitStatus(path: string): AsyncGenerator<HyperforgeEvent>;
  /** Bump a package version (patch, minor, or major) */
  packageBumpVersion(bump: string, packagePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Publish a single package to its registry (crates.io or Hackage) */
  packagePublish(packagePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Initialize .hyperforge/config.toml for an existing repository */
  repoConfigInit(forges: string, org: string, path: string, visibility?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Set SSH key in a repository's .hyperforge/config.toml */
  repoConfigSetSshKey(forge: string, path: string, sshKey: string): AsyncGenerator<HyperforgeEvent>;
  /** Show .hyperforge/config.toml for a repository */
  repoConfigShow(path: string): AsyncGenerator<HyperforgeEvent>;
  /** Create a new repository in LocalForge */
  reposCreate(name: string, org: string, origin: string, visibility: string, description?: string | null, mirrors?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Delete a repository */
  reposDelete(name: string, org: string): AsyncGenerator<HyperforgeEvent>;
  /** Import repositories from a remote forge */
  reposImport(forge: string, org: string): AsyncGenerator<HyperforgeEvent>;
  /** List repositories for an organization (from LocalForge) */
  reposList(org: string): AsyncGenerator<HyperforgeEvent>;
  /** Rename a repository on remote forge(s) and in local config */
  reposRename(newName: string, oldName: string, org: string, forges?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Update an existing repository */
  reposUpdate(name: string, org: string, description?: string | null, visibility?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  schema(): Promise<unknown>;
  /** Show hyperforge status */
  status(): AsyncGenerator<HyperforgeEvent>;
  /** Test workspace diff (demonstration) */
  testDiff(): AsyncGenerator<HyperforgeEvent>;
  /** Show version info */
  version(): AsyncGenerator<HyperforgeEvent>;
  /** Bump version for all packages in a workspace */
  workspaceBumpAll(workspacePath: string, bump?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Detect package renames (directory name differs from package name) */
  workspaceDetectRenames(workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Compute sync diff between local and a remote forge */
  workspaceDiff(forge: string, org: string): AsyncGenerator<HyperforgeEvent>;
  /** Fix path dependency versions for crates.io publishing - Adds versions to runtime deps (dependencies, build-dependencies) - Removes versions from dev deps (dev-dependencies) */
  workspaceFixDepVersions(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Find and fix stale path dependencies in Cargo.toml files */
  workspaceFixPathDeps(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Initialize .hyperforge/config.toml for all repos in a workspace */
  workspaceInitConfigs(forges: string, org: string, workspacePath: string, defaultBranch?: string | null, sshKey?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Strip prerelease suffixes from package versions (e.g., -worktree, -alpha) */
  workspaceNormalizeVersions(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** List all packages in a workspace */
  workspacePackages(workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Prepare workspace for publishing - runs all fix commands in sequence */
  workspacePreparePublish(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Publish all packages in a workspace in dependency order */
  workspacePublishAll(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Get the topological publish order for packages in a workspace */
  workspacePublishOrder(workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Fetch/pull from all remotes for all repos in a workspace - PARALLEL with throttling */
  workspacePull(workspacePath: string, maxParallel?: number | null, pull?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Complete package rename: forges + local directory + git remotes Derives new name from package manifest (Cargo.toml or *.cabal) */
  workspaceRename(dirName: string, org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Rename all packages where directory name differs from package name */
  workspaceRenameAll(org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Rename repositories on forges based on detected package renames */
  workspaceRenameForgeRepos(org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Set default branch for all repos in a workspace (local + remote) - PARALLEL */
  workspaceSetDefaultBranch(branch: string, org: string, workspacePath: string, dryRun?: boolean | null, force?: boolean | null, push?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Setup [patch.crates-io] for local development  Converts path+version dependencies to version-only with patches: plexus-core = { path = "../plexus-core", version = "0.2.1" } Becomes: plexus-core = "0.2.1" [patch.crates-io] plexus-core = { path = "../plexus-core" }  This pattern allows: - Local development uses path patches (local changes) - cargo publish ignores [patch] sections (clean publish) */
  workspaceSetupPatches(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Check for dirty (uncommitted changes) repos in a workspace */
  workspaceStatus(workspacePath: string, includeWorktrees?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Sync local configuration to a remote forge */
  workspaceSync(forge: string, org: string, dryRun?: boolean | null, noDelete?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Check sync status across all forges */
  workspaceSyncStatus(org: string): AsyncGenerator<HyperforgeEvent>;
  /** Test push connectivity for all repos in a workspace */
  workspaceTestPush(workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Update a package version across the workspace */
  workspaceUpdatePackage(newVersion: string, packageName: string, workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Update SSH key in all git repos within a workspace */
  workspaceUpdateSsh(org: string, workspacePath: string): AsyncGenerator<HyperforgeEvent>;
  /** Verify workspace configuration and health */
  workspaceVerify(org?: string | null): AsyncGenerator<HyperforgeEvent>;
  /** Verify and sync git config for all repos in a workspace */
  workspaceVerifySync(org: string, workspacePath: string, fix?: boolean | null): AsyncGenerator<HyperforgeEvent>;
  /** Yank old package names from a Cargo registry */
  workspaceYankOldPackages(workspacePath: string, dryRun?: boolean | null, registry?: string | null): AsyncGenerator<HyperforgeEvent>;
}

/** Typed client implementation for hyperforge plugin */
export class HyperforgeClientImpl implements HyperforgeClient {
  constructor(private readonly rpc: RpcClient) {}

  /** Set SSH key for an organization */
  async *configSetSshKey(org: string, sshKey: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.config_set_ssh_key', { org: org, ssh_key: sshKey });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Show organization configuration */
  async *configShow(org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.config_show', { org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Initialize hyperforge for a git repository */
  async *gitInit(forges: string, org: string, path: string, description?: string | null, dryRun?: boolean | null, force?: boolean | null, repoName?: string | null, sshKeys?: string | null, visibility?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.git_init', { description: description, dry_run: dryRun, force: force, forges: forges, org: org, path: path, repo_name: repoName, ssh_keys: sshKeys, visibility: visibility });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Push to configured forges */
  async *gitPush(path: string, dryRun?: boolean | null, force?: boolean | null, onlyForges?: string | null, setUpstream?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.git_push', { dry_run: dryRun, force: force, only_forges: onlyForges, path: path, set_upstream: setUpstream });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Show git repository status */
  async *gitStatus(path: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.git_status', { path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Bump a package version (patch, minor, or major) */
  async *packageBumpVersion(bump: string, packagePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.package_bump_version', { bump: bump, package_path: packagePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Publish a single package to its registry (crates.io or Hackage) */
  async *packagePublish(packagePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.package_publish', { dry_run: dryRun, package_path: packagePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Initialize .hyperforge/config.toml for an existing repository */
  async *repoConfigInit(forges: string, org: string, path: string, visibility?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repo_config_init', { forges: forges, org: org, path: path, visibility: visibility });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Set SSH key in a repository's .hyperforge/config.toml */
  async *repoConfigSetSshKey(forge: string, path: string, sshKey: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repo_config_set_ssh_key', { forge: forge, path: path, ssh_key: sshKey });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Show .hyperforge/config.toml for a repository */
  async *repoConfigShow(path: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repo_config_show', { path: path });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Create a new repository in LocalForge */
  async *reposCreate(name: string, org: string, origin: string, visibility: string, description?: string | null, mirrors?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_create', { description: description, mirrors: mirrors, name: name, org: org, origin: origin, visibility: visibility });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Delete a repository */
  async *reposDelete(name: string, org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_delete', { name: name, org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Import repositories from a remote forge */
  async *reposImport(forge: string, org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_import', { forge: forge, org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** List repositories for an organization (from LocalForge) */
  async *reposList(org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_list', { org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Rename a repository on remote forge(s) and in local config */
  async *reposRename(newName: string, oldName: string, org: string, forges?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_rename', { forges: forges, new_name: newName, old_name: oldName, org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Update an existing repository */
  async *reposUpdate(name: string, org: string, description?: string | null, visibility?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.repos_update', { description: description, name: name, org: org, visibility: visibility });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Get plugin or method schema. Pass {"method": "name"} for a specific method. */
  async schema(): Promise<unknown> {
    const stream = this.rpc.call('hyperforge.schema', {});
    return collectOne<unknown>(stream);
  }

  /** Show hyperforge status */
  async *status(): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.status', {});
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Test workspace diff (demonstration) */
  async *testDiff(): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.test_diff', {});
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Show version info */
  async *version(): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.version', {});
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Bump version for all packages in a workspace */
  async *workspaceBumpAll(workspacePath: string, bump?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_bump_all', { bump: bump, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Detect package renames (directory name differs from package name) */
  async *workspaceDetectRenames(workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_detect_renames', { workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Compute sync diff between local and a remote forge */
  async *workspaceDiff(forge: string, org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_diff', { forge: forge, org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Fix path dependency versions for crates.io publishing - Adds versions to runtime deps (dependencies, build-dependencies) - Removes versions from dev deps (dev-dependencies) */
  async *workspaceFixDepVersions(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_fix_dep_versions', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Find and fix stale path dependencies in Cargo.toml files */
  async *workspaceFixPathDeps(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_fix_path_deps', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Initialize .hyperforge/config.toml for all repos in a workspace */
  async *workspaceInitConfigs(forges: string, org: string, workspacePath: string, defaultBranch?: string | null, sshKey?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_init_configs', { default_branch: defaultBranch, forges: forges, org: org, ssh_key: sshKey, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Strip prerelease suffixes from package versions (e.g., -worktree, -alpha) */
  async *workspaceNormalizeVersions(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_normalize_versions', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** List all packages in a workspace */
  async *workspacePackages(workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_packages', { workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Prepare workspace for publishing - runs all fix commands in sequence */
  async *workspacePreparePublish(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_prepare_publish', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Publish all packages in a workspace in dependency order */
  async *workspacePublishAll(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_publish_all', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Get the topological publish order for packages in a workspace */
  async *workspacePublishOrder(workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_publish_order', { workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Fetch/pull from all remotes for all repos in a workspace - PARALLEL with throttling */
  async *workspacePull(workspacePath: string, maxParallel?: number | null, pull?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_pull', { max_parallel: maxParallel, pull: pull, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Complete package rename: forges + local directory + git remotes Derives new name from package manifest (Cargo.toml or *.cabal) */
  async *workspaceRename(dirName: string, org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_rename', { dir_name: dirName, dry_run: dryRun, org: org, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Rename all packages where directory name differs from package name */
  async *workspaceRenameAll(org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_rename_all', { dry_run: dryRun, org: org, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Rename repositories on forges based on detected package renames */
  async *workspaceRenameForgeRepos(org: string, workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_rename_forge_repos', { dry_run: dryRun, org: org, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Set default branch for all repos in a workspace (local + remote) - PARALLEL */
  async *workspaceSetDefaultBranch(branch: string, org: string, workspacePath: string, dryRun?: boolean | null, force?: boolean | null, push?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_set_default_branch', { branch: branch, dry_run: dryRun, force: force, org: org, push: push, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Setup [patch.crates-io] for local development  Converts path+version dependencies to version-only with patches: plexus-core = { path = "../plexus-core", version = "0.2.1" } Becomes: plexus-core = "0.2.1" [patch.crates-io] plexus-core = { path = "../plexus-core" }  This pattern allows: - Local development uses path patches (local changes) - cargo publish ignores [patch] sections (clean publish) */
  async *workspaceSetupPatches(workspacePath: string, dryRun?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_setup_patches', { dry_run: dryRun, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Check for dirty (uncommitted changes) repos in a workspace */
  async *workspaceStatus(workspacePath: string, includeWorktrees?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_status', { include_worktrees: includeWorktrees, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Sync local configuration to a remote forge */
  async *workspaceSync(forge: string, org: string, dryRun?: boolean | null, noDelete?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_sync', { dry_run: dryRun, forge: forge, no_delete: noDelete, org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Check sync status across all forges */
  async *workspaceSyncStatus(org: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_sync_status', { org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Test push connectivity for all repos in a workspace */
  async *workspaceTestPush(workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_test_push', { workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Update a package version across the workspace */
  async *workspaceUpdatePackage(newVersion: string, packageName: string, workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_update_package', { new_version: newVersion, package_name: packageName, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Update SSH key in all git repos within a workspace */
  async *workspaceUpdateSsh(org: string, workspacePath: string): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_update_ssh', { org: org, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Verify workspace configuration and health */
  async *workspaceVerify(org?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_verify', { org: org });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Verify and sync git config for all repos in a workspace */
  async *workspaceVerifySync(org: string, workspacePath: string, fix?: boolean | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_verify_sync', { fix: fix, org: org, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

  /** Yank old package names from a Cargo registry */
  async *workspaceYankOldPackages(workspacePath: string, dryRun?: boolean | null, registry?: string | null): AsyncGenerator<HyperforgeEvent> {
    const stream = this.rpc.call('hyperforge.workspace_yank_old_packages', { dry_run: dryRun, registry: registry, workspace_path: workspacePath });
    yield* extractData<HyperforgeEvent>(stream);
  }

}

/** Create a typed hyperforge client from an RPC client */
export function createHyperforgeClient(rpc: RpcClient): HyperforgeClient {
  return new HyperforgeClientImpl(rpc);
}