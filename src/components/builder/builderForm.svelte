<script>
// @ts-nocheck
    import EditForm from "./editForm.svelte";
    import Fa from 'svelte-fa'
    import { faEdit } from '@fortawesome/free-solid-svg-icons'    

    let items = [
        {
            name: "Teksts", 
            icons: faEdit, 
            data: {
                "field_name": "Teksts-hash", // slugified field name with unique hash in current form
                "name": "Teksts",
                "type": "teksts",
                "options": {
                    "numRows": false,
                    "numLength": true,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "E-pasts", 
            icons: faEdit, 
            data: {
                "field_name": "E-pasts-hash", // slugified field name with unique hash in current form
                "name": "E-pasts",
                "type": "epasts",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Skaitlis", 
            icons: faEdit, 
            data: {
                "field_name": "Skaitlis-hash", // slugified field name with unique hash in current form
                "name": "Skaitlis",
                "type": "skaitlis",
                "options": {
                    "numRows": false,
                    "numLength": true,
                    "itemType": true,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Apraksts", 
            icons: faEdit, 
            data: {
                "field_name": "Apraksts-hash", // slugified field name with unique hash in current form
                "name": "Apraksts",
                "type": "apraksts",
                "options": {
                    "numRows": true,
                    "numLength": true,
                    "itemType": true,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Apraksts", 
            icons: faEdit, 
            data: {
                "field_name": "Apraksts-hash", // slugified field name with unique hash in current form
                "name": "Apraksts",
                "type": "apraksts",
                "options": {
                    "numRows": true,
                    "numLength": true,
                    "itemType": true,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Izvēles rūtiņa", 
            icons: faEdit, 
            data: {
                "field_name": "Izvēles-rūtiņa-hash", // slugified field name with unique hash in current form
                "name": "Izvēles rūtiņa",
                "type": "izvēles-rūtiņa",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": true,
                    "isVertical": true,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Izvēles iespēja", 
            icons: faEdit, 
            data: {
                "field_name": "Izvēles-iespēja-hash", // slugified field name with unique hash in current form
                "name": "Izvēles iespēja",
                "type": "Izvēles-iespēja",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": true,
                    "isVertical": true,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Izvēles saraksts", 
            icons: faEdit, 
            data: {
                "field_name": "Izvēles-saraksts-hash", // slugified field name with unique hash in current form
                "name": "Izvēles saraksts",
                "type": "Izvēles-saraksts",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": true,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Datums / laiks", 
            icons: faEdit, 
            data: {
                "field_name": "Datums-laiks-hash", // slugified field name with unique hash in current form
                "name": "Datums / laiks",
                "type": "Datums-laiks",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": true,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Datne", 
            icons: faEdit, 
            data: {
                "field_name": "Datne-hash", // slugified field name with unique hash in current form
                "name": "Datne",
                "type": "datne",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Virsraksts", 
            icons: faEdit, 
            data: {
                "field_name": "Virsraksts-hash", // slugified field name with unique hash in current form
                "name": "Virsraksts",
                "type": "virsraksts",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Atdalītājs", 
            icons: faEdit, 
            data: {
                "field_name": "Atdalītājs-hash", // slugified field name with unique hash in current form
                "name": "Atdalītājs",
                "type": "atdalītājs",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Adrese", 
            icons: faEdit, 
            data: {
                "field_name": "Adrese-hash", // slugified field name with unique hash in current form
                "name": "Adrese",
                "type": "adrese",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": false
                },
                "required": false,
                "validation": ""
            }
        },
        {
            name: "Tabulārā ievade", 
            icons: faEdit, 
            data: {
                "field_name": "Tabulārā-ievade-hash", // slugified field name with unique hash in current form
                "name": "Tabulārā ievade",
                "type": "Tabulārā-ievade",
                "options": {
                    "numRows": false,
                    "numLength": false,
                    "itemType": false,  // ["text", "number", "email"]
                    "addItems": false,
                    "isVertical": false,
                    "addTableRowsCols": true
                },
                "required": false,
                "validation": ""
            }
        }   
    ]

    let form_builder = []

    const dragStart = (event, index) => {
        
        let data = items[index].data;
   	    event.dataTransfer.setData('itemData', JSON.stringify(data));
    }

    const drop = (event) => {
        event.preventDefault();
        const json = event.dataTransfer.getData("itemData");
		const data = JSON.parse(json);
        const builder = { id: form_builder.length > 0 ? form_builder[form_builder.length-1].id + 1 : 0, ...data }
        form_builder = [...form_builder, builder];
        console.log(form_builder)
    }

    const removeItem = (index) => {
        form_builder = form_builder.filter(item => item.id != index)
    }
</script>

<div class="flex gap-10">
    <div class="w-1/4">
        <div class="w-full text-left item-list-container mb-6">
            {#each items as item, i}
                <div 
                    class="flex items" 
                    on:dragstart={event => dragStart(event, i)}
                    draggable={true}>
                    <span><Fa icon={item.icons} class="icon-width" /></span>
                     {item.name}
                </div>
            {/each}
        </div>
        <div class="w-full text-left item-list-container">
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="flex items">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="icon-width"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" /></svg>Sadarbības partneri
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="flex items">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="icon-width">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>Personas
            </label>
            <!-- svelte-ignore a11y-label-has-associated-control -->
            <label class="flex items">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" class="icon-width">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25zM6.75 12h.008v.008H6.75V12zm0 3h.008v.008H6.75V15zm0 3h.008v.008H6.75V18z" />
                  </svg>Laika grafiks
            </label>
        </div>
    </div>
    <div class="w-3/4 text-center edit-container" 
        on:drop={drop}
        on:dragenter={() => {}}
        on:dragleave={() => {}}
        ondragover="return false">
        {#each form_builder as form (form.id)}
            <EditForm {...form}  on:removeItem={event => removeItem(form.id)} />
        {/each}    
    </div>
</div>

<style>
    .gap-10 {
        gap: 28px;
    }

    .item-list-container {
        border: 1px solid #B9B9B9;
        padding: 8px;
        border-radius: 4px;
    }

    .items {
        padding: 8px 4px 8px 4px;
    }

    .icon-width {
        width: 16px;
        height: 16px;
        margin: 4px 4px 0 4px;
    }

    .edit-container {
        background-color: #F4F4F4;
        border: 1px dotted #B9B9B9;
        border-radius: 4px;
        padding: 16px;
    }
</style>