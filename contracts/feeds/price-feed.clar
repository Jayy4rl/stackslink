
;; title: price-feed
;; version: 0.1.0
;; summary: Aggregates price data from multiple nodes
;; description: Stores and aggregates price submissions to provide a trusted reference price.

;; traits
;; TODO: Implement trait for aggregator

;; constants
;; TODO: Define deviation thresholds
;; TODO: Define heartbeat intervals

;; data maps
;; TODO: Map round-id to aggregated-price
;; TODO: Map round-id + node to submission

;; public functions

;; TODO: submit-price
;; Input: round-id, price
;; Logic:
;; 1. Check if sender is authorized node
;; 2. Store submission
;; 3. If enough submissions, calculate median/average
;; 4. Update current price

;; read only functions

;; TODO: get-latest-price
;; Output: price, timestamp, round-id
