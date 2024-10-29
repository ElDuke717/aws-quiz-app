# AWS Redshift Study Guide

## Key Concepts and Definitions

### What is Redshift?
- Fully managed, petabyte-scale data warehouse service
- Based on PostgreSQL, but optimized for OLAP (Online Analytical Processing)
- 10x better performance than traditional data warehouses
- Uses columnar storage instead of row-based storage

### Core Components
- Clusters
- Nodes
- Node Types:
  - Dense Compute (dc2)
  - Dense Storage (ds2)
  - RA3 (newest generation)
- Leader Node
- Compute Nodes

## Memory Aids

### SPECS Mnemonic for Redshift Features
- **S**calable (1 node to many)
- **P**arallel Processing
- **E**ncrypted (at rest and in transit)
- **C**olumnar Storage
- **S**napshots & Backups

### DIAL Mnemonic for Data Loading
- **D**ata sources (S3, DynamoDB, EMR)
- **I**nsert commands
- **A**uto copy from S3
- **L**oad in parallel

## Visual Aid

```
[Client] → [Leader Node] → [Compute Node 1]
                        → [Compute Node 2]
                        → [Compute Node 3]
```

## Comparison Tables

### Node Type Comparison

| Feature | Dense Compute | Dense Storage | RA3 |
|---------|--------------|---------------|-----|
| Use Case | Fast performance | Large data sets | Flexible scaling |
| Storage | SSD | HDD | Managed storage |
| Max Storage | 326 TB | 2 PB | Unlimited |
| Cost | Higher | Lower | Variable |

### Redshift vs Traditional Database

| Feature | Redshift | Traditional DB |
|---------|----------|----------------|
| Storage | Columnar | Row-based |
| Scalability | Highly scalable | Limited |
| Query Type | OLAP | OLTP |
| Cost | Pay per node | Instance based |

## Process Outlines

### Cluster Creation Process
1. Choose node type
2. Select number of nodes
3. Configure network settings
4. Set up security groups
5. Create parameter groups
6. Launch cluster

### Data Loading Process
1. Prepare source data
2. Create target tables
3. Configure COPY command
4. Execute load
5. Verify data
6. Vacuum and analyze

## Practice Questions

1. Q: What is the maximum number of nodes in a Redshift cluster?
   - A: 100 nodes (except for ds2.xlarge which is limited to 32 nodes)

2. Q: Which compression encoding does Redshift automatically assign when using COPY?
   - A: The COPY command analyzes data and automatically assigns compression encoding if not specified

3. Q: How often are automated snapshots taken in Redshift?
   - A: Every 8 hours or after 5 GB of changes per node

4. Q: What is the purpose of the Leader node in Redshift?
   - A: To manage client connections and receive queries, then distribute workload to compute nodes

5. Q: Which statement about Redshift encryption is correct?
   - A: Redshift supports both AWS KMS and HSM for encryption at rest

## Common Points of Confusion

### Misconceptions
- Redshift is not the same as RDS PostgreSQL, despite being based on PostgreSQL
- Redshift is not automatically scalable like Aurora
- Snapshots are retained even after cluster deletion (unless specified otherwise)

### Important Clarifications
- Redshift requires manual resizing
- Cross-region snapshots require manual copying
- Redshift Spectrum is different from regular Redshift (queries data directly in S3)
- Enhanced VPC Routing affects how COPY and UNLOAD commands work
- Maintenance windows are required for patches and updates

### Security Considerations
- Must use IAM roles for S3 access
- SSL certificates for encryption in transit
- Cluster security groups are different from VPC security groups
- KMS keys must be in same region as cluster