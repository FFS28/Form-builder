<script>
	import BuilderForm from "$components/builder/builderForm.svelte";
    
    let current = 1;
    
    let menu = [
        { title: "Apraksts", link: "#"},
        { title: "Pieteikuma forma", link: "#"},
        { title: "Budžets", link: "#"},
        { title: "Riski (0)", link: "#"},
        { title: "Kritēriji", link: "#"},
        { title: "Datnes (0)", link: "#"},
        { title: "Pārbaudes (0)", link: "#"},
        { title: "Atskaites (0)", link: "#"}
    ];
</script>

<div class="container mx-auto">
	<div class="pt-6">
		<ul class="flex border-b">
            {#each menu as {title, link}, i}
                <li class="mr-1" on:click="{()=>current = i}">
                    <a class="{current === i ? "bg-white" : ""} inline-block border-l border-t border-r rounded-t py-2 px-4 font-semibold" href="{link}">{title}</a>
                </li>
            {/each}
        </ul>
        <div class="w-full bg-white p-7">
            <BuilderForm />    
        </div>
	</div>
</div>

<style>
    .p-7 {
        padding: 28px;
    }
</style>