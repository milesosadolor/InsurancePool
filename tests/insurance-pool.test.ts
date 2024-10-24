import { describe, it, expect, clarify } from 'clarinet';

// Load the contract
const insurancePoolContract = clarify.load("insurance-pool.clar");

describe("Insurance Pool Contract", () => {
  
  it("should allow a project to stake funds", async () => {
    const receipt = await insurancePoolContract.callPublicFn("stake", [100, 2000]);
    expect(receipt.success).toBe(true);
    
    const projectData = await insurancePoolContract.getMapData("insurance-pool", { projectId: 100 });
    expect(projectData.stakedAmount).toBe(2000);
  });
  
  it("should fail if the stake amount is below the minimum", async () => {
    const receipt = await insurancePoolContract.callPublicFn("stake", [101, 500]);
    expect(receipt.success).toBe(false);  // Minimum stake is 1000
  });
  
  it("should confirm if a project is covered", async () => {
    await insurancePoolContract.callPublicFn("stake", [102, 2000]);
    
    const isCovered = await insurancePoolContract.callReadOnlyFn("is-covered", [102]);
    expect(isCovered.ok).toBe(true);
  });
  
  it("should allow withdrawal if the lock period is over", async () => {
    await insurancePoolContract.callPublicFn("stake", [103, 2000]);
    
    // Simulate the passing of blocks
    await clarify.mineBlocks(LOCK_PERIOD + 1);
    
    const receipt = await insurancePoolContract.callPublicFn("withdraw-stake", [103]);
    expect(receipt.success).toBe(true);
    
    const projectData = await insurancePoolContract.getMapData("insurance-pool", { projectId: 103 });
    expect(projectData).toBeNull(); // Funds were withdrawn, so the project is no longer in the map
  });
  
});
