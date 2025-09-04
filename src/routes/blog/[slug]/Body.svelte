<script>
    import Header from "../../../components/Header.svelte";
    import Paragraph from "../../../components/Paragraph.svelte";
    import Image from "../../../components/Image.svelte";

    let { component, data } = $props();

    let componentList = {
        header : Header,
        paragraph : Paragraph,
        image : Image,
    }

    // @ts-ignore
    let Chosen = $state(componentList[component]);
</script>


<Chosen {...data}></Chosen>
