# Hostile Review — Zenon Dynamic Plasma Specification

## Overall Assessment

Verdict: **Mechanically strong, economically dangerous, implementation-ready with policy caveats**

This is a solid implementation specification.

Mechanically:

> **Pass**

Economically:

> **Needs explicit warning labels**

Consensus determinism is handled well:

* fixed-point arithmetic only
* canonical rounding rules
* explicit epoch boundary ordering
* replay-from-chain authority
* overflow reasoning
* atomic epoch transition
* base-Plasma accounting (non-recursive)

That survives hostile review.

The strongest invariant is:

> **account base Plasma, multiply only at validation**

That is the spine of the design.

Had multiplied Plasma been fed back into epoch accounting, the controller would recursively self-amplify.

You correctly avoided that.

That preserves controller sanity.

---

## What Survives Attack

### 1. Base Plasma Accounting Is Correct

Excellent.

Rule:

```text id="n8k3rv"
epoch_consumed_base_plasma += base_required_plasma(tx)
```

not:

```text id="w2m7qx"
+= multiplied_required_plasma(tx)
```

That prevents:

* recursive inflation
* runaway multiplier compounding
* nonlinear accounting distortion
* controller instability

This is absolutely correct.

This survives hostile review.

---

### 2. Fixed-Point Determinism Is Excellent

Excellent.

No:

* float32
* float64
* implementation-defined rounding

Only:

> integer fixed-point arithmetic

Consensus systems demand that.

Correct.

This survives hostile review.

---

### 3. EMA Dampening Is Well Tuned Mechanically

Good.

One burst:

> modest movement

Repeated sustained load:

> compounding increase

That is correct controller shape.

Not twitchy.

Not dead.

Responsive but damped.

Mechanically good.

This survives hostile review.

---

### 4. Replay Authority Is Correct

Excellent.

Canonical truth:

> chain history

Persisted state:

> cache only

If inconsistent:

> replay wins

That is mature consensus engineering.

Correct.

This survives hostile review.

---

### 5. Atomic Epoch Close Is Correctly Identified

Excellent.

This is a subtle but important catch.

Without atomicity:

* half-updated multiplier
* stale accumulator
* divergent restart state

Consensus split risk.

You correctly make atomic close mandatory.

This survives hostile review.

---

## Major Weaknesses

## 1. Baseline Denominator Is Economically Brutal

This is the biggest issue.

Baseline:

```text id="a7q2mn"
100 × 21,000 × 720
```

This assumes:

> simple-transfer saturation

But heavy-data transactions consume vastly more base Plasma.

Result:

very low transaction count can saturate controller.

Example:

2 heavy transactions / momentum:

> already exceeds baseline

That means:

> multiplier rises under modest throughput if traffic is heavy

Mechanically valid.

Economically severe.

This is not congestion pricing.

This is:

> **resource-class amplification pricing**

Need stronger warning label.

---

## 2. Whale Traffic Dominates Controller

Large accounts pushing heavy transactions can drive:

```text id="v3k8rp"
U → 1
```

quickly.

Then:

```text id="m5t1qx"
M → MMax
```

Everyone pays higher Plasma.

That creates:

> large-user congestion externality

Even honest high-value usage creates global fee escalation.

Need explicit economic acknowledgment.

---

## 3. Recovery Is Extremely Slow

You estimate:

~71 days from max toward normal under zero activity.

That is long.

Very long.

Effect:

after congestion event:

> elevated Plasma pricing persists for months

That punishes future quiet periods.

This is anti-reset gaming.

Good.

But also:

> anti-recovery

Need stronger operator warning.

---

## 4. Deadband May Still Drift Upward

Because:

rise coefficient:

```text id="r1n6kv"
0.50
```

fall coefficient:

```text id="x4m2pq"
0.10
```

Recovery is much weaker than escalation.

Long-term asymmetric traffic likely creates upward bias.

Need simulation of:

> realistic mixed traffic

not just synthetic edge bands.

---

## 5. Hard Clamp at 5.0x Is Arbitrary

Mechanically fine.

Economically:

why 5?

Could be:

* too low during spam
* too high during honest demand

This is policy.

Not engineering inevitability.

Need explicit:

> governance / protocol tuning parameter

Clarify policy nature.

---

## Missing Abuse Cases

Need explicit discussion of:

### Honest Whale Saturation

Legitimate heavy use pushes fees sharply upward.

---

### Griefing Through Heavy Payload Mix

Attacker intentionally uses expensive transaction classes to raise global multiplier.

---

### Long Tail Punishment

Network stays expensive long after congestion ends.

---

### Oscillation Farming

Attackers time bursts around decay slope.

---

### Low-Activity Network Distortion

Sparse network naturally trends toward:

```text id="q7v3mn"
MMin = 0.5x
```

This halves normal Plasma pricing structurally.

That changes economic floor.

Need discussion.

---

## Recommended Tightening

### Add Explicit Policy Warning

State plainly:

> Dynamic Plasma is a policy controller, not purely mechanical resource pricing

---

### Add Economic Simulation Appendix

Must test:

* whale honest usage
* spam heavy-data mix
* quiet network decay
* oscillation attack
* mixed normal wallet traffic

---

### Consider Faster Midrange Recovery

Current:

very sticky high multiplier.

Maybe intentional—but harsh.

---

### Re-evaluate Denominator

Simple-transfer denominator is clean.

But economically blunt.

Likely future revision point.

---

## Final Verdict

### Mechanical Correctness

**Excellent**

### Consensus Determinism

**Excellent**

### Replay Safety

**Excellent**

### Arithmetic Safety

**Excellent**

### Economic Predictability

**Moderate**

### Economic Fairness

**Questionable**

### Abuse Resistance

**Mixed**

### Implementation Readiness

**Mechanically yes / economically caution**

---

## Final Verdict

As engineering:

> **Strong**

As economics:

> **Aggressive**

As first implementation:

> **Viable, but should ship with eyes open**

Core invariant survives hostile review:

> account base Plasma
> multiply only at validation
> replay from canonical chain
> chain history remains authority
