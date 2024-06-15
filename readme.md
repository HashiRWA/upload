# The base path is process.env.HOME which can be different in different os

# After adding the compiled contract before deploying it to the blockchain, it needs to be optimised.

```
 docker run --rm -v "$(pwd)":/code \
  --mount type=volume,source="$(basename "$(pwd)")_cache",target=/code/target \
  --mount type=volume,source=registry_cache,target=/usr/local/cargo/registry \
  cosmwasm/rust-optimizer:0.12.11
```

# Upload Contract:

useUpload("Work/hackathons/upload/hashiRWA_contracts.wasm")

# Verify Contract:

useVerifyCodeID(154)

# Instantiate Contract:

useInstantiate(121,{ "counter": 0 },"Poke Counter")
useInstantiate(154,{ "counter": 0 },"Deployed bank")

# FOR CW 20

<!-- mantra1uen40cgamn8u0k8zwfyqqzypdn36fr2vrfwh0ghawpq66je0p8zslgzxxc -->
<!-- mantra1677vsq6cs4z3hd629h44zppg3ya8y7txyaxjryud5f54lnwj09rs96npfl -->
<!-- mantra12yng80emt5zyptsauuravswr6hknum56vrrckvdwda25jve0zg2q2lt7wd -->
<!-- mantra1p2ds40jhuf7d3h0n0heseue7msyqk0evzcks2pk4344wfe8rtx3sfx09fp -->
<!-- Deposit Working -->
<!-- mantra190f353hxtswfdsux8c45wedh7wkngz2hrgphnrmfefhmh0yurmws35pd5t -->
<!-- Withdraw Working -->
<!-- mantra1pcpdl0kts7djtwwyyx5pn0xpg2t7husy3jmxxhc26tnlk7qc4rvqrgqj47 -->
<!-- Withdraw Interest Working -->
<!--mantra16dlu5xshfdem7h3hw3y6m3qgrxavwxs4wrhac2uxcewzc76qwqaq6whynk -->
<!-- Borrow / Loan Working  -->
<!-- mantra16zcqaswsvp2zv29wll2jzx7j67vwlm9qvdlp372467l5h2ddaqnsrreum6 -->
