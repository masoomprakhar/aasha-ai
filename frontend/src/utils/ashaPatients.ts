import type { BeneficiaryProfile } from '../types';

/** Patients assigned to the logged-in ASHA worker. */
export function patientsForAsha(
  beneficiaries: BeneficiaryProfile[],
  ashaUserId?: string,
): BeneficiaryProfile[] {
  if (!ashaUserId) return beneficiaries;
  return beneficiaries.filter((b) => b.linkedAshaId === ashaUserId);
}
