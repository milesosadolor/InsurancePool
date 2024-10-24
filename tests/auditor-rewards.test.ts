import { describe, it, expect, clarify } from 'clarinet';

// Load the contract
const auditorRewardsContract = clarify.load("auditor-rewards.clar");

describe("Auditor Rewards Contract", () => {
  
  it("should reward auditors for reviewing contracts", async () => {
    const receipt = await auditorRewardsContract.callPublicFn("reward-auditor", ["ST1A2B3C4D5E6F"]);
    expect(receipt.success).toBe(true);
    
    const auditorData = await auditorRewardsContract.getMapData("auditors", { auditorId: "ST1A2B3C4D5E6F" });
    expect(auditorData.rewardsEarned).toBe(100);
  });
  
  it("should accumulate rewards for auditors", async () => {
    await auditorRewardsContract.callPublicFn("reward-auditor", ["ST1A2B3C4D5E6F"]);
    await auditorRewardsContract.callPublicFn("reward-auditor", ["ST1A2B3C4D5E6F"]);
    
    const auditorData = await auditorRewardsContract.getMapData("auditors", { auditorId: "ST1A2B3C4D5E6F" });
    expect(auditorData.rewardsEarned).toBe(200); // Accumulated rewards
  });
  
  it("should return zero rewards for non-existing auditors", async () => {
    const rewards = await auditorRewardsContract.callReadOnlyFn("get-auditor-rewards", ["ST2X2X3X4X5X6X"]);
    expect(rewards.result).toBe("u0"); // No rewards for this auditor yet
  });
  
});
