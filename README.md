# StacksLink: Decentralized Oracle Network for Stacks

StacksLink is a robust, modular decentralized oracle network built natively on the Stacks blockchain. It is designed to bridge the gap between Bitcoin/Stacks smart contracts and real-world data, enabling high-value DeFi applications, insurance products, and other complex use cases that require off-chain information.

## Table of Contents

1.  Project Overview
2.  System Architecture
3.  Module Descriptions
4.  Request Lifecycle
5.  Data Aggregation Mechanism
6.  Security Considerations
7.  Getting Started
8.  Testing Strategy & TODOs
9.  Roadmap
10. License

## 1. Project Overview

Smart contracts on Stacks are deterministic and isolated from the outside world. They cannot natively access data such as asset prices, weather data, or sports results. StacksLink solves this "oracle problem" by providing a secure middleware that fetches data from off-chain sources and delivers it on-chain in a verifiable manner.

The primary goals of StacksLink are:
-   **Reliability**: Ensuring data availability through a decentralized network of node operators.
-   **Integrity**: Using cryptographic proofs and aggregation mechanisms to prevent data manipulation.
-   **Flexibility**: Supporting various data types, from simple price feeds to complex API responses.

## 2. System Architecture

The StacksLink architecture is composed of several interacting layers. The following text-based diagram illustrates the high-level flow of data and control.

```mermaid
graph TD
    User[User / Consumer Contract] -->|1. Request Data| Core[Core Contract]
    Core -->|2. Emit Event| Nodes[Node Operators (Off-Chain)]
    Nodes -->|3. Fetch Data| API[External APIs / Data Sources]
    API -->|4. Return Data| Nodes
    Nodes -->|5. Submit Response| Core
    Core -->|6. Callback| User
    
    subgraph On-Chain
    Core
    User
    Feeds[Price Feeds]
    Registry[Node Registry]
    Gov[Governance]
    end
    
    subgraph Off-Chain
    Nodes
    API
    end
    
    Feeds -->|Read| User
    Registry -->|Authorize| Core
    Gov -->|Manage| Registry
    Gov -->|Manage| Core
```

## 3. Module Descriptions

The codebase is organized into distinct modules to promote separation of concerns and upgradability.

### Core (`contracts/core/`)
The heart of the system. It handles the lifecycle of data requests.
-   **stackslink-core.clar**: Manages request creation, event emission, and response fulfillment. It verifies that responses come from authorized nodes and routes the data back to the requesting contract.

### Feeds (`contracts/feeds/`)
Specialized contracts for continuous data streams, primarily asset prices.
-   **price-feed.clar**: Implements an aggregation model (e.g., medianizer) to combine data from multiple nodes into a single trusted reference price. This is what DeFi protocols typically consume.

### Operators (`contracts/operators/`)
Manages the network of participants.
-   **node-registry.clar**: A whitelist of authorized node operators. It stores metadata such as public keys, API endpoints, and reputation scores. It ensures that only vetted nodes can participate in the network.

### Governance (`contracts/governance/`)
Controls protocol parameters and permissions.
-   **access-control.clar**: Defines roles (e.g., Admin, Operator Manager) and permissions. It allows for decentralized management of the protocol, such as adding new nodes or upgrading contracts.

### Traits (`contracts/traits/`)
Defines standard interfaces for interoperability.
-   **oracle-trait.clar**: Specifies the standard functions that any oracle contract must implement, ensuring that consumer contracts can interact with different oracle implementations uniformly.

## 4. Request Lifecycle

1.  **Initiation**: A consumer smart contract calls the `request-data` function on the `stackslink-core` contract, specifying the job ID (what data to fetch) and payment.
2.  **Event Emission**: The core contract emits a `OracleRequest` event containing the request details.
3.  **Off-Chain Processing**: StacksLink nodes monitoring the blockchain detect the event. They fetch the required data from off-chain APIs.
4.  **Fulfillment**: The assigned node(s) submit a transaction to the `fulfill-request` function on the core contract with the data.
5.  **Callback**: The core contract validates the submission and calls the callback function defined in the original request, delivering the data to the consumer contract.

## 5. Data Aggregation Mechanism

For critical data like price feeds, relying on a single node is risky. StacksLink employs an aggregation mechanism:

1.  **Rounds**: Data submission occurs in rounds.
2.  **Thresholds**: A minimum number of nodes must submit data for a round to be valid.
3.  **Calculation**: The contract calculates the median of the submitted values to filter out outliers and malicious data.
4.  **Update**: The aggregated value is stored as the official price for that block height.

## 6. Security Considerations

-   **Sybil Resistance**: The `node-registry` prevents an attacker from spinning up multiple fake nodes to manipulate data.
-   **Staking (Future)**: Nodes will be required to stake tokens, which can be slashed if they provide incorrect data or go offline.
-   **Governance**: Critical functions are protected by the `access-control` module, ensuring that no single entity has absolute control over the network.

## 7. Getting Started

### Prerequisites
-   Clarinet
-   Node.js and NPM
-   Docker (for local Clarinet environment)

### Installation
1.  Clone the repository.
2.  Navigate to the project directory.
3.  Install dependencies:
    ```bash
    npm install
    ```

## 8. Testing Strategy & TODOs

We employ a rigorous testing strategy using Vitest and Clarinet SDK to ensure protocol safety.

### Unit Tests
Tests that verify the logic of individual functions in isolation.

-   [ ] **Core Contract Tests**
    -   [ ] Test `request-data`: Verify event emission and storage of request details.
    -   [ ] Test `fulfill-request`: Verify data validation and callback execution.
    -   [ ] Test unauthorized fulfillment attempts.
    -   [ ] Test expiration of stale requests.

-   [ ] **Price Feed Tests**
    -   [ ] Test `submit-price`: Verify storage of submissions.
    -   [ ] Test aggregation logic (median calculation) with odd and even numbers of inputs.
    -   [ ] Test outlier filtering.
    -   [ ] Test `get-latest-price` retrieval.

-   [ ] **Node Registry Tests**
    -   [ ] Test `register-node`: Verify addition to the whitelist.
    -   [ ] Test `remove-node`: Verify removal and permission revocation.
    -   [ ] Test duplicate registration prevention.

-   [ ] **Access Control Tests**
    -   [ ] Test role assignment and revocation.
    -   [ ] Test permission checks on protected functions.

### Integration Tests
Tests that verify the interaction between multiple contracts (e.g., Consumer -> Core -> Node).

-   [ ] **End-to-End Request Flow**
    -   [ ] Simulate a full cycle: Consumer requests data -> Node detects -> Node fulfills -> Consumer receives data.
    -   [ ] Verify token transfers (payment) during the flow.

-   [ ] **Governance Upgrades**
    -   [ ] Simulate a contract upgrade via governance vote.

## 9. Roadmap

-   **Phase 1: Foundation**
    -   Define Oracle Traits
    -   Implement Node Registry
    -   Develop Core Request/Response Model

-   **Phase 2: Aggregation**
    -   Implement Price Feed Aggregation
    -   Add Governance/Access Control

-   **Phase 3: Hardening**
    -   Comprehensive Testing
    -   Audit
    -   Mainnet Launch

## 10. License

MIT
