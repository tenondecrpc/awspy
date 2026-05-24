# AWS Architecture Icons (curated subset)

Decorative icon drop used by the `DecorativePattern` atom and (optionally) by
the `IconTile` atom. The icons in this directory MUST be the unedited official
SVG files.

## Source

AWS publishes the AWS Architecture Icons set at
https://aws.amazon.com/architecture/icons/. The set is distributed officially
by AWS for community use in technical content, presentations, and documentation
about AWS services.

## Drop policy

- Each file in this directory is the unedited official SVG. Tints are applied
  by the consuming component via CSS `currentColor`.
- The set committed here is a curated subset (12 to 20 files) covering common
  service categories: storage, compute, networking, database, AI/ML, security.
- When the AWS Architecture Icons set is updated upstream, refresh the files
  here and update the version date below.

## Version

- Version date: 2026-05-24 (initial drop for the visual refresh).

## License note

The AWS Architecture Icons are provided by AWS for community use. They are
trademarks of Amazon.com, Inc. or its affiliates and remain the property of
AWS. They MUST NOT be modified or used in a way that misrepresents the
relationship with AWS. The site uses them only as decorative iconography in
contexts that respect the AWS brand guidelines.

## Files

The committed file list is intentionally minimal. Add only the icons you need
for the decorative pattern. Each file is named after the AWS service it
represents (lowercase, hyphenated):

- `compute-ec2.svg`
- `compute-lambda.svg`
- `compute-fargate.svg`
- `storage-s3.svg`
- `database-rds.svg`
- `database-dynamodb.svg`
- `network-cloudfront.svg`
- `network-route53.svg`
- `ai-bedrock.svg`
- `ai-sagemaker.svg`
- `security-iam.svg`
- `security-cognito.svg`

When you add a file, name it consistently with this list and update
`components/atoms/DecorativePattern.tsx` to include it in the icon registry.
