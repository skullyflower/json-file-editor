<script lang="ts">
  let { inputtext, updatetext } = $props()
</script>

{#if inputtext.length < 40}
  <input type="text" value={inputtext} onchange={updatetext} />
{:else}
  <textarea onchange={updatetext}>{inputtext}</textarea>
{/if}

<style>
  input,
  textarea {
    border-style: solid;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    font-size: medium;
    line-height: 1.5;
    padding: 3px 10px;
    border-radius: 10px;
    width: 100%;
    background-color: var(--ev-c-gray-3);
    color: var(--ev-c-white-mute);
  }
</style>
