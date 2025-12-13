;; title: oracle
;; version: 1.0.0
;; summary: A simple oracle contract for Stacks
;; description: Allows a trusted owner to update asset prices and others to read them.

;; traits
;;

;; token definitions
;;

;; constants
(define-constant contract-owner tx-sender)
(define-constant err-owner-only (err u100))
(define-constant err-asset-not-found (err u101))

;; data vars
;;

;; data maps
(define-map prices
    principal
    uint
)

;; public functions

(define-public (update-price
        (asset principal)
        (price uint)
    )
    (begin
        (asserts! (is-eq tx-sender contract-owner) err-owner-only)
        (ok (map-set prices asset price))
    )
)

;; read only functions

(define-read-only (get-price (asset principal))
    (ok (map-get? prices asset))
)

;; private functions
;;
