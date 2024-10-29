# Amazon Aurora Study Guide for AWS Solutions Architect Associate

## Key Concepts and Definitions

### Core Concepts
- Amazon Aurora is a fully managed relational database engine compatible with MySQL and PostgreSQL
- Up to 5x performance of MySQL and 3x performance of PostgreSQL
- Storage automatically scales from 10GB to 128TB
- Compute resources can scale up to 96 vCPUs and 768GB memory

### Key Features
- Automatic backups
- Point-in-time recovery
- Continuous backup to S3
- Replication across 3 AZs
- Up to 15 Read Replicas
- Serverless option available

## Memory Aids

### CARS Framework for Aurora Benefits
- **C**ost-effective (pay for what you use)
- **A**utomated (scaling, patching, backups)
- **R**esilient (multi-AZ, self-healing)
- **S**calable (storage and compute)

### PREP for Aurora Storage
- **P**artitioned across 6 copies
- **R**eplicated across 3 AZs
- **E**ndpoint-managed connections
- **P**ersistent in shared storage

## Visual Aid

```
[Primary Instance] ←→ [Shared Storage Volume]
       ↓                   ↑
[Read Replica 1]           |
[Read Replica 2]           |
[Read Replica n]  ←→ [Replicated Data]
```

## Comparison Table

| Feature | Aurora | Standard RDS |
|---------|---------|--------------|
| Storage Scaling | Automatic | Manual |
| Max Storage | 128TB | 16TB |
| Replication | 15 replicas | 5 replicas |
| Recovery Time | Instantaneous | Minutes |
| Failover Time | < 30 seconds | > 60 seconds |
| Backtrack | Supported | Not supported |

## Process: Aurora Failover

1. Monitor database health
2. Detect failure in primary instance
3. Update DNS record to point to replica
4. Promote replica to primary
5. Create new replica to maintain redundancy

## Practice Questions

1. Q: What is the maximum number of Read Replicas supported by Aurora?
   - A: 15 Read Replicas

2. Q: How many copies of data does Aurora maintain across Availability Zones?
   - A: 6 copies across 3 AZs

3. Q: What is the minimum storage size for an Aurora database?
   - A: 10GB

4. Q: Which feature allows you to "rewind" an Aurora database to a specific point in time?
   - A: Backtrack

5. Q: What is the maximum storage capacity of an Aurora database?
   - A: 128TB

## Common Points of Confusion

1. **Aurora Serverless vs. Provisioned**
- Serverless automatically adjusts capacity
- Provisioned requires manual scaling
- Both use same underlying Aurora engine

2. **Endpoints**
- Cluster endpoint (writes) vs. Reader endpoint (reads)
- Custom endpoints can be created
- Instance endpoints are unique to each DB instance

3. **Backup Retention**
- Automated backups: 1-35 days
- Manual snapshots: unlimited retention
- Continuous backup to S3

4. **Scaling**
- Storage scales automatically
- Compute scaling requires manual intervention
- Read scaling through addition of replicas

5. **Cost Model**
- Pay for compute resources by the hour
- Storage charged per GB-month
- I/O charges apply for Aurora Serverless
- No charge for replica replication