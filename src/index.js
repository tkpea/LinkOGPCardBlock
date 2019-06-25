const { registerBlockType } = wp.blocks;
const { Component } = wp.element;
const { RichText} = wp.editor;
import { TextControl, Button, ExternalLink } from '@wordpress/components';
import apiFetch from '@wordpress/api-fetch';
import axios from 'axios'

registerBlockType ( 'tk/ogp-card-block', {
    title: 'LinkOGPCard',
    icon: 'feedback',
    category: 'layout',
    attributes: {
		title: {
			type: 'array',
			source: 'children',
			selector: '.title',
        },
		url: {
			type: 'string',
			source: 'children',
			selector: '.url',
        }, 
		description: {
			type: 'array',
			source: 'children',
			selector: '.description',
        }, 
		domain: {
			type: 'array',
			source: 'children',
            selector: '.domain',
		},                        
		image: {
			type: 'string',
			source: 'attribute',
			selector: 'img',
			attribute: 'src',
        },
        content: {
			type: 'array',
			source: 'html',
			selector: '.content',
        },       
        
    },
    edit: class extends Component{   
        constructor(props) {
            super(...arguments)
            this.props = props
            this.state={
                url: '',
                isLoading: false,
                isError: false,
                message: '',
                ogp: null,
            }
        }
        getOGP(){
            if(!this.props.attributes.url.match(/^(https?|ftp)(:\/\/[-_.!~*\'()a-zA-Z0-9;\/?:\@&=+\$,%#]+)$/)) {
                alert("Please enter a valid URL.");
                return false;
            } else {
                this.setState({isLoading: true})
                let params = new URLSearchParams()
                params.append('action','myplugin_get_ogp')
                params.append('url',this.props.attributes.url )
             
                axios.post('/wp-admin/admin-ajax.php',params
                ).then((response) =>{
                    const json = response.data
                    this.setState({
                        isLoading: false,
                        ogp:json,
                    })
                    console.log(json)
                    this.props.setAttributes({title: json.title})
                    this.props.setAttributes({description: json.description})                    
                    this.props.setAttributes({domain: this.props.attributes.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1]})   
                    if (json.image) {
                        this.props.setAttributes({ image: json.image})
                                                
                    }
                }).catch((err)=>{
                    console.log(err)
                    this.setState({isLoading: false})
                })
            }
        }
        render () {
            
            if( this.props.attributes.title[0] == undefined){  
                return (
                    <div className="components-placeholder">
                        <div className="components-placeholder__label">
                            OGPカード
                        </div>
                        <div style={{"width":"90%"}}>
                            <TextControl
                            label="URLを入力"
                            onChange={(val)=>{
                                this.props.setAttributes({ url: val})
                            }}
                            />
                            <Button 
                            isPrimary="true"
                            onClick={()=>this.getOGP()}
                            >OGPを読み込む!</Button>
                        </div>
                    </div>
                )                    
            } else {
                return (
                    <div className={ this.props.className }>
                        <a href={this.props.attributes.url} target="_blank">
                       
                            {(() => {
                                if (this.props.attributes.image){
                                    return (
                                        <div className="ogp-card-block-thumbnail">
                                        <img className="image" src={ this.props.attributes.image  }  /> 
                                        </div>
                                    )
                                }
                            }) () }

                            <div class="ogp-card-block-detail">
                                <div class="ogp-card-block-content">
                                    <RichText.Content tagName="p" className="title" value={ this.props.attributes.title } />
                                    <RichText.Content tagName="p" className="description" value={ this.props.attributes.description } />
                                </div>
                                <RichText.Content tagName="p" className="domain" value={ this.props.attributes.domain } />
                            </div>
                        </a>  
                    </div>
                )
            }
        }
    },
    save: function( props ) {
        const {
            className,
            attributes:{
                title,
                image,
                description,
                domain,
                url                
            }
        } = props
        return (
            <div className={ className }>
                <a href={url} target="_blank">
		
                    <div className="ogp-card-block-thumbnail">
                    <img className="recipe-image" src={ image  }  /> 
                    </div>                       
     

                    <div class="ogp-card-block-detail">
                        <div class="ogp-card-block-content">
                            <p className="title">{title}</p>
                            <RichText.Content tagName="p" className="description" value={ description } />
                        </div>
                        <RichText.Content tagName="p" className="domain" value={ domain } />
                    </div>
                </a>
            </div>
        )

    
      }
});

