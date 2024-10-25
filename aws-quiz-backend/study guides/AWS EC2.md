# AWS EC2 Study Guide for AWS Solutions Architect Associate Exam

## Key Concepts and Definitions

### What is EC2?
- **Amazon Elastic Compute Cloud (EC2)**: A web service that provides resizable compute capacity in the cloud. It allows users to run virtual servers (instances) on-demand.

### Key Terms
- **Instance**: A virtual server in the EC2 environment.
- **AMI (Amazon Machine Image)**: A pre-configured template for launching EC2 instances, which includes the OS, application server, and applications.
- **Instance Types**: Different configurations of CPU, memory, storage, and networking capacity. Examples: t2.micro, m5.large.
- **Security Groups**: Virtual firewalls that control inbound and outbound traffic to EC2 instances.
- **Key Pair**: A set of security credentials that you use to connect to your instance.
- **Elastic Block Store (EBS)**: A scalable block storage service for use with EC2 instances.
- **Elastic IP**: A static IP address designed for dynamic cloud computing.

## Mnemonics or Memory Aids
- **“I AM A SKE”**: 
  - **I**nstance
  - **A**MI
  - **M**emory
  - **S**ecurity Group
  - **K**ey Pair
  - **E**BS

## Comparison Table

| Feature                 | EC2 Instance Types          | EBS Volume Types          | Pricing Model                           |
|-------------------------|-----------------------------|--------------------------|-----------------------------------------|
| Purpose                 | Varies by instance type     | Persistent storage       | On-Demand, Reserved, Spot Instances     |
| Performance             | General, Compute, Memory    | SSD, Magnetic            | Pay-as-you-go for On-Demand             |
| Use Case                | Web applications, Databases | Data storage for EC2     | Cost-effective long-term for Reserved   |
| Availability            | Multiple AZs                | Snapshots for backup     | Spot can be interrupted                  |

## Outlines of Processes

### Launching an EC2 Instance
1. **Select AMI**: Choose an Amazon Machine Image from AWS marketplace or your own.
2. **Choose Instance Type**: Select based on required CPU, memory, storage.
3. **Configure Instance**: Set up details like network, IAM role, monitoring.
4. **Add Storage**: Attach EBS volumes if needed.
5. **Configure Security Group**: Set inbound/outbound rules.
6. **Review and Launch**: Review configurations and launch the instance.
7. **Connect to Instance**: Use SSH or RDP based on instance OS.

## Practice Questions
1. What is the purpose of an Amazon Machine Image (AMI)?
   - A) To provide static IP addresses
   - B) To launch EC2 instances with pre-configured settings
   - C) To manage security groups
   - D) To monitor instance performance

2. Which EC2 instance type is best suited for applications requiring a high level of compute performance?
   - A) t2.micro
   - B) m5.large
   - C) c5.2xlarge
   - D) t3.nano

3. What is the primary function of a security group in AWS EC2?
   - A) To store data
   - B) To define network traffic rules for instances
   - C) To manage application performance
   - D) To create backups

4. What pricing model allows you to bid on spare EC2 capacity?
   - A) On-Demand
   - B) Reserved
   - C) Spot Instances
   - D) Savings Plans

5. Which storage option is recommended for low-latency, high-throughput workloads?
   - A) Magnetic EBS
   - B) General Purpose SSD (gp2)
   - C) Provisioned IOPS SSD (io1)
   - D) S3 Standard

## Potential Points of Confusion
- **Difference between On-Demand and Spot Instances**: On-Demand allows you to pay for compute capacity by the hour without commitment, while Spot Instances let you bid for unused capacity, which can lead to termination if the price exceeds your bid.
- **EBS vs. Instance Store**: EBS provides persistent storage that remains after instance termination, while instance store is temporary storage that is lost when the instance is stopped or terminated.
- **Security Groups vs. Network ACLs**: Security Groups are stateful and associated with instances, while Network ACLs are stateless and associated with subnets. 

This study guide should help in preparing for the AWS Solutions Architect Associate Exam, particularly regarding AWS EC2.