import 'server-only'

// Boundary 2 of 3. Owns the review decision: fresh reviewer authorization at execution time,
// immutable revision + payload hash check, first-wins update, decision + event + wake delivery in one transaction.
// The UI reaches this through a Server Action only. There is no other writer.
export async function decide(_input: { requestId: string; revision: number; payloadHash: string; decision: 'approve' | 'decline' | 'send_back'; reason?: string }) {
  // Increment D.
  throw new Error('not implemented')
}
