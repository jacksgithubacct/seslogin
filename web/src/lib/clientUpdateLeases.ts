export type ClientUpdateLease = {
  uuid: string;
  description: string;
};

const activeLeases = new Map<string, string>();
const listeners = new Set<(leases: ClientUpdateLease[]) => void>();

function snapshotLeases(): ClientUpdateLease[] {
  return Array.from(activeLeases.entries()).map(([uuid, description]) => ({
    uuid,
    description,
  }));
}

function emitLeases() {
  const leases = snapshotLeases();
  for (const listener of listeners) {
    listener(leases);
  }
}

export function blockClientUpdates(uuid: string, description: string): void {
  const normalizedDescription = description.trim();
  activeLeases.set(
    uuid,
    normalizedDescription.length > 0 ? normalizedDescription : uuid,
  );
  emitLeases();
}

export function clearBlockClientUpdates(uuid: string): void {
  if (!activeLeases.delete(uuid)) {
    return;
  }
  // Defer notifications to the next tick so any new blockers can register first.
  setTimeout(() => {
    emitLeases();
  }, 0);
}

export function getClientUpdateLeases(): ClientUpdateLease[] {
  return snapshotLeases();
}

export function onClientUpdateLeasesChange(
  listener: (leases: ClientUpdateLease[]) => void,
): () => void {
  listeners.add(listener);
  listener(snapshotLeases());
  return () => {
    listeners.delete(listener);
  };
}
