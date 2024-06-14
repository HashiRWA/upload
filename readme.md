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

useVerifyCodeID(121)

# Instantiate Contract:

useInstantiate(121,{ "counter": 0 },"Poke Counter")
useInstantiate(151,{ "counter": 0 },"Deployed bank")

# FOR CW 20

<!-- mantra1uen40cgamn8u0k8zwfyqqzypdn36fr2vrfwh0ghawpq66je0p8zslgzxxc -->
<!-- mantra1677vsq6cs4z3hd629h44zppg3ya8y7txyaxjryud5f54lnwj09rs96npfl -->
<!-- mantra12yng80emt5zyptsauuravswr6hknum56vrrckvdwda25jve0zg2q2lt7wd -->
<!-- mantra1p2ds40jhuf7d3h0n0heseue7msyqk0evzcks2pk4344wfe8rtx3sfx09fp -->
<!-- mantra190f353hxtswfdsux8c45wedh7wkngz2hrgphnrmfefhmh0yurmws35pd5t -->