
;; title: oracle-trait
;; version: 0.1.0
;; summary: Standard interface for oracle interactions

(define-trait oracle-trait
    (
        ;; Request data from the oracle
        (request-data (uint (optional (buff 2048)) (optional (buff 2048))) (response uint uint))
        
        ;; Callback function for fulfillment (usually defined in consumer, but trait might define the shape)
        ;; Note: In Clarity, callbacks are usually passed as contract-principal + function-name, 
        ;; so the trait here might define the Oracle side.
    )
)

;; TODO: Define aggregator-trait for price feeds
;; TODO: Define link-token-trait if using a custom token
