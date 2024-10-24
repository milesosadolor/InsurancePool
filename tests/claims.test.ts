import { describe, it, expect, clarify } from 'clarinet';

// Load the contract
const claimManagementContract = clarify.load("claim-management.clar");

describe("Claim Management Contract", () => {
  
  it("should allow submitting a claim", async () => {
    const receipt = await claimManagementContract.callPublicFn("submit-claim", [100, 5000]);
    expect(receipt.success).toBe(true);
    
    const claimData = await claimManagementContract.getMapData("claims", { projectId: 100 });
    expect(claimData.claimAmount).toBe(5000);
    expect(claimData.votesFor).toBe(0);
    expect(claimData.votesAgainst).toBe(0);
    expect(claimData.resolved).toBe(false);
  });
  
  it("should allow pool members to vote on claims", async () => {
    await claimManagementContract.callPublicFn("submit-claim", [101, 4000]);
    
    // Vote to approve the claim
    const voteReceipt = await claimManagementContract.callPublicFn("vote-on-claim", [101, true]);
    expect(voteReceipt.success).toBe(true);
    
    const claimData = await claimManagementContract.getMapData("claims", { projectId: 101 });
    expect(claimData.votesFor).toBe(1);
    expect(claimData.votesAgainst).toBe(0);
  });
  
  it("should resolve claims based on votes", async () => {
    await claimManagementContract.callPublicFn("submit-claim", [102, 3000]);
    await claimManagementContract.callPublicFn("vote-on-claim", [102, true]); // Approve
    await claimManagementContract.callPublicFn("vote-on-claim", [102, false]); // Reject
    
    const resolveReceipt = await claimManagementContract.callPublicFn("resolve-claim", [102]);
    expect(resolveReceipt.success).toBe(true);
    
    const claimData = await claimManagementContract.getMapData("claims", { projectId: 102 });
    expect(claimData.resolved).toBe(true);
    
    // Since votes were equal, the claim will likely be rejected (adjust logic accordingly)
    expect(resolveReceipt.result).toContain("Claim rejected");
  });
  
  it("should fail to resolve claims if not enough votes", async () => {
    await claimManagementContract.callPublicFn("submit-claim", [103, 2000]);
    
    // No votes have been cast
    const resolveReceipt = await claimManagementContract.callPublicFn("resolve-claim", [103]);
    expect(resolveReceipt.success).toBe(false); // Should fail due to insufficient votes
  });
  
});
