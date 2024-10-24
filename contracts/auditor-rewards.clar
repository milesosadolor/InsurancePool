(define-map auditors
  { auditor-id: principal }
  { rewards-earned: uint })

(define-constant AUDIT_REWARD u100) ;; Example reward amount

;; Reward auditors for reviewing the contracts
(define-public (reward-auditor (auditor-id principal))
  (let ((auditor-info (map-get auditors { auditor-id: auditor-id })))
    (if (is-none auditor-info)
      (map-set auditors { auditor-id: auditor-id } { rewards-earned: AUDIT_REWARD })
      (let (
        (current-rewards (get rewards-earned (unwrap! auditor-info (err u1))))
      )
        (map-set auditors { auditor-id: auditor-id } { rewards-earned: (+ current-rewards AUDIT_REWARD) })))
    (ok "Reward distributed")))

;; Check auditor rewards
(define-read-only (get-auditor-rewards (auditor-id principal))
  (let ((auditor-info (map-get auditors { auditor-id: auditor-id })))
    (if (is-none auditor-info)
      (ok u0)
      (ok (get rewards-earned (unwrap! auditor-info (err u1)))))))
