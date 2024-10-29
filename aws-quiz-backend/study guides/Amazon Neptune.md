# AWS Neptune Study Guide - Solutions Architect Associate

## Key Concepts and Definitions

### Core Concepts
- Amazon Neptune is a fully managed graph database service
- Supports two graph models:
  - Property Graph (using Apache TinkerPop/Gremlin)
  - RDF (using SPARQL)
- Optimized for complex, highly connected data
- Supports up to 15 read replicas
- Automatically scales storage from 10GB to 64TB

### Common Use Cases
- Social networking applications
- Recommendation engines
- Knowledge graphs
- Fraud detection patterns
- Network/IT operations
- Identity graphs

## Memory Aids

### GRAPH - Neptune's Key Features
- **G**remlin & SPARQL query languages
- **R**eplication across AZs
- **A**utomated backups and restores
- **P**roperty graph & RDF support
- **H**igh availability with failover

### NODES - Neptune's Benefits
- **N**o schema constraints
- **O**nline scaling
- **D**urable and fault-tolerant
- **E**ncrypted at rest
- **S**ecure with IAM integration

## Visual Aid

```
[Primary Instance] ━━━━━┓
       ┃                ┃
       ┃                ┃
[Read Replica 1]  [Read Replica 2]
       ┃                ┃
    [Client]        [Client]
```

## Comparison Table

| Feature | Neptune | RDS | DynamoDB |
|---------|---------|-----|-----------|
| Data Model | Graph | Relational | Key-Value/Document |
| Query Language | Gremlin/SPARQL | SQL | PartiQL/DynamoDB API |
| Max Storage | 64TB | 64TB | Unlimited |
| Use Case | Connected Data | Structured Data | Semi-structured Data |
| Scaling | Read Replicas | Read Replicas | Auto-scaling |

## Process: Creating a Neptune Database

1. Choose cluster settings
   - Instance class
   - Multi-AZ deployment
   - VPC settings
2. Configure security
   - IAM authentication
   - VPC security groups
3. Set backup retention
4. Enable encryption
5. Create database endpoints
6. Configure monitoring

## Practice Questions

1. What is the maximum number of read replicas supported by Neptune?
   - A) 5
   - B) 10
   - C) 15
   - D) 20
   *Answer: C) 15*

2. Which query languages does Neptune support?
   - A) SQL and NoSQL
   - B) Gremlin and SPARQL
   - C) GraphQL and SQL
   - D) Cypher and Neo4j
   *Answer: B) Gremlin and SPARQL*

3. Neptune is best suited for which type of data?
   - A) Time-series data
   - B) Highly connected data
   - C) Unstructured documents
   - D) Binary objects
   *Answer: B) Highly connected data*

4. Which feature is NOT available in Neptune?
   - A) Automatic failover
   - B) Cross-region replication
   - C) Encryption at rest
   - D) IAM authentication
   *Answer: B) Cross-region replication*

5. What is the minimum storage size for a Neptune database?
   - A) 1GB
   - B) 5GB
   - C) 10GB
   - D) 20GB
   *Answer: C) 10GB*

## Common Points of Confusion

1. **Neptune vs. RDS**
   - Neptune is specifically for graph data
   - RDS is for traditional relational data

2. **Query Language Choice**
   - Gremlin for property graphs
   - SPARQL for RDF data
   - Cannot mix query languages on same database

3. **Scaling Limitations**
   - Storage scales automatically
   - Compute scaling requires manual intervention
   - Read replicas are limited to 15

4. **Backup Behavior**
   - Automated backups are continuous
   - Manual snapshots don't impact performance
   - Restore creates new cluster

5. **Security Configuration**
   - Must be deployed within VPC
   - IAM authentication is optional
   - SSL encryption is mandatory for connections