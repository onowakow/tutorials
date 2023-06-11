# Remove Drafts in Docusaurus in Azure Pipeline

```bash
find docusaur/blog -type f -name 'DRAFT*' -exec rm {} +
```

```bash
find docusaur/blog -type d -name 'DRAFT*' -exec rmdir {} +
```
