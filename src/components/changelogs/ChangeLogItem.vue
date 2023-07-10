<template>
    <q-item>
        <q-item-section>
            <q-item-label class="row justify-between q-mb-xs">{{title}} <span class="text-caption text-grey">{{formatElapsedTime(dateTime)}} </span></q-item-label>
            <q-item-label caption>{{description}}</q-item-label>
        </q-item-section>
    </q-item>
</template>

<script setup>
    const props = defineProps(["title", "dateTime", "description"])

    function formatElapsedTime(date) {
        console.log(date)
        const elapsed = new Date() - new Date(date);
        const seconds = Math.floor(elapsed / 1000);
        const minutes = Math.floor(seconds / 60);
        const hours = Math.floor(minutes / 60);
        const days = Math.floor(hours / 24);

        if (days > 0) {
            return `${days} day${days > 1 ? 's' : ''} ago`;
        } else if (hours > 0) {
            return `${hours} hour${hours > 1 ? 's' : ''} ago`;
        } else if (minutes > 0) {
            return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
        } else {
            return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
        }
    }
</script>