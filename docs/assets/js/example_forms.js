
var forms = {
  "basic": {
        legend: 'Basic Form',
        fields:[
        {label: 'Field Label', name: 'label', type: "select"}
        ]
    },
    "types": {
        fields:[
            {label: 'Text', type: 'text'},
            {label: 'Hidden', type: 'hidden', value: 'hidden field'},
            {label: 'Number', type: 'number'},
            {label: 'Color', type: 'color'},
            {label: 'Email', type: 'email'},
            {label: 'Textarea', type: 'textarea'},
            {label: 'Checkbox', type: 'checkbox'},
            {label: 'Select', type: 'select', options: [1,2,3]},
            {label: 'Radio', type: 'radio', options: [1,2,3]},
            {label: 'Fieldset', type: 'fieldset', fields:[
                {label: 'Fieldset Text 1', name: 'text1', type: 'text'},
                {label: 'Fieldset Text 2', name: 'text2', type: 'text'}
            ]},

        ]
    },
    "values": {
        fields:[
            {label: 'Text', type: 'text', value: 'Some Text'},
            {label: 'Hidden', type: 'hidden', value: 'hidden field'},
            {label: 'Number', type: 'number',value: 24},
            {label: 'Color', type: 'color',value: "#00FF00"},
            {label: 'Email', type: 'email',value: 'test@gmail.com'},
            {label: 'Textarea', type: 'textarea',value: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut sit amet mollis purus."},
            {label: 'Checkbox', type: 'checkbox', value: true},
            {label: 'Select', type: 'select', options:[1,2,3], value: 3},
            {label: 'Radio', type: 'radio', options: [1,2,3], value: 2}
        ]
    },
    "placeholder": {
        fields:[
            {label: 'Text', type: 'text', placeholder: 'Type here'},
            {label: 'Number', type: 'number', placeholder:'Count them'},
            {label: 'Email', type: 'email', placeholder:'test@gmail.com'},
            {label: 'Textarea', type: 'textarea', placeholder: "Type your long form answer here"},
            {label: 'Select', type: 'select', options: [1,2,3], placeholder: 'Choose One'},
        ]
    },
    "columns": {
        fields:[
            {label: 'Three', columns: 3},
            {label: 'Six', columns: 6},
            {label: 'Six again', columns: 6},
            {label: 'Five', columns: 5},
            {label: '1', columns: 1},
            {label: 'Eight', columns: 8},
            {label: 'Four', columns: 4},
            {label: 'Two', columns: 2},
            {label: 'Ten', columns: 10},
            {label: 'Twelve', columns: 12},
            {label: 'Seven', columns: 7},
            {label: 'New Row', columns: 4, row: true}
        ]
    },
    "generate": {
        fields:[
            {label: 'Up to Ten, min defaults to 0', type: 'select', max: 10},
            {label: 'Start at two, step defaults to 1', type:'select', min: 2, max: 10},
            {label: 'Step By Threes', type: 'select', min: 1, max: 10, step: 3},
            {label: "Max must be set", type: 'select', min: 1, step: 3}
        ]
    },
    "format": {
        fields:[
            {label: 'Custom label', name: 'label', type: 'select', max: 10, format: { label: 'Option {{index}}' }},
            {label: 'Custom value', name: 'value', type: 'select', max: 12, min: 1, format: { value:'option-{{value}}' }},
            {label: 'Both', name: 'both', type: 'select', max: 12, min: 1, format: { label: '{{value}} Column(s)', value: 'col-md-{{value}}'}, help: 'Select a bootstrap column class'}
        ]
    }

}