(define-map claims
  { project-id: uint }
  { claim-amount: uint, votes-for: uint, votes-against: uint, resolved: bool })

(define-public (submit-claim (project-id uint) (claim-amount uint))
  (if (<= claim-amount u0)
      (err u1) ;; Error: Invalid claim amount
      (begin
        (map-set claims
          { project-id: project-id }
          { claim-amount: claim-amount, votes-for: u0, votes-against: u0, resolved: false })
        (ok ()))))

;; Voting on a claim by pool members
(define-public (vote-on-claim (project-id uint) (approve bool))
  (let ((claim (map-get claims { project-id: project-id })))
    (if (is-none claim)
      (err u404) ;; Error: Claim not found
      (let (
        (votes-for (get votes-for (unwrap! claim (err u1))))
        (votes-against (get votes-against (unwrap! claim (err u1))))
        (resolved (get resolved (unwrap! claim (err u1))))
      )
        (if resolved
          (err u2) ;; Error: Claim already resolved
          (if approve
            (map-set claims
              { project-id: project-id }
              { claim-amount: (get claim-amount (unwrap! claim (err u1))),
                votes-for: (+ votes-for u1), votes-against: votes-against, resolved: false })
            (map-set claims
              { project-id: project-id }
              { claim-amount: (get claim-amount (unwrap! claim (err u1))),
                votes-for: votes-for, votes-against: (+ votes-against u1), resolved: false })
            )))
        (ok ()))))
