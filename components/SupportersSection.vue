<template>
  <div class="">
    <div class="text-h5 text-center q-mt-md text-bold">
      Big Thank You To Our Supporters
    </div>
    <div class="flex justify-center q-pa-md">
      <div 
        v-for="(supporter, i) in supporters" 
        :key="supporter.name"
        class="q-gutter-smdoutline"
        >
          <q-chip 
          :class="clipBackground(i)"
          :outline="i >= 3"
          class="glass q-mb-sm text-weight-medium">
            <q-avatar>
              {{supporter.name.charAt(0)}}
            </q-avatar>
            {{supporter.name}}
          </q-chip>
      </div>
    </div>
     <div 
     class="text-subtitle2 text-center text-grey-8"
     >
      If you would like to support this platform, please consider donating via the link below.
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Supporter } from '~/models/supporter';


const supporters = ref<Supporter[]>([])

onMounted(async () => {
  const response = await fetch(
    useRuntimeConfig().public.getsupportersEndpoint,
    {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    })
  const data = (await response.json()) as Record<string, Supporter[]>;
  console.log('Fetched supporters data:', data);
  const supportersData = data["supporters"] as Supporter[];
  // Sort supporters by rank if available, otherwise keep original order
  supporters.value = supportersData.sort((a, b) => {
    if (a.amount && b.amount) {
      return b.amount - a.amount;
    }
    return 0; // Keep original order if no ranks are present
  });
})

function clipBackground(i: number) {
  switch (i) {
  //   case 0:
  //     return 'supporter-gold';
  //   case 1:
  //   case 2:
  //     return 'supporter-gradient';
    default:
      return '';
  }
}

</script>

<style>
.supporter-gradient {
  background: linear-gradient(
    90deg,
    #EE8882    0%,
    #F09078   33%,
    #F09A6E   66%,
    #F0A36A   100%
  );
  background-size: 200% 100%;
  background-position: left center;
  transition: background-position 0.5s ease;
  color: white;
}
.supporter-gradient:hover {
  background: linear-gradient(
    270deg,
    #F0A36A 0%,
    #F09A6E 33%,
    #F09078 66%,
    #EE8882 100%
  );
}

.supporter-gold {
  background: linear-gradient(
    90deg,
    #FFD700,
    #FFC107,
    #FFB300,
    #FFD700
  );
  background-size: 200% 100%;
  background-position: left center;
  transition: background-position 0.5s ease;
  color: white; /* good contrast on gold */
}

.supporter-gold:hover {
  background-position: right center;
}

.glass {
  position: relative;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.125);
}
/* this sits _behind_ the content */
.glass::before {
  content: '';
  position: absolute;
  inset: 0;
  background: rgba(17,25,40,0.21);
  backdrop-filter: blur(16px) saturate(180%);
  -webkit-backdrop-filter: blur(16px) saturate(180%);
  pointer-events: none;
  z-index: 0;
}

/* now your actual children sit above it at z-index:1 */
.glass > * {
  position: relative;
  z-index: 1;
}
</style>