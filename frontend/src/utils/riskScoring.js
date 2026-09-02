/**
 * Canonical Risk Scoring Classification Engine
 * 
 * Standard Enterprise Risk Boundaries:
 * - score > 70:  CRITICAL (P1)  -> Crimson / Danger (#dc2626)
 * - score >= 40: ELEVATED (P2)  -> Amber / Warning (#d97706)
 * - score < 40:  CONTROLLED (P3)-> Emerald / Healthy (#16a34a)
 * 
 * Boundary verification:
 * At score = 70, this function returns ELEVATED (P2, Amber / 'warn'),
 * establishing 100% unified semantic agreement across Gauge, Header,
 * Metric Cards, What-If Sandbox, and Asset tables.
 */

export function getRiskLevel(score = 0) {
  const num = Number(score) || 0;

  if (num > 70) {
    return {
      level: 'CRITICAL (P1)',
      priority: 'P1',
      tone: 'danger',
      badgeTone: 'danger',
      label: 'Critical Posture',
      color: '#dc2626',
      isCritical: true,
      description: 'Severe risk exposure requiring immediate executive intervention.'
    };
  }

  if (num >= 40) {
    return {
      level: 'ELEVATED',
      priority: 'P2',
      tone: 'warn',
      badgeTone: 'warn',
      label: 'Elevated Posture',
      color: '#d97706',
      isCritical: false,
      description: 'Moderate risk posture requiring prioritized control mitigation.'
    };
  }

  return {
    level: 'CONTROLLED',
    priority: 'P3',
    tone: 'ok',
    badgeTone: 'ok',
    label: 'Controlled Posture',
    color: '#16a34a',
    isCritical: false,
    description: 'Residual enterprise exposure within board-approved risk appetite.'
  };
}
