const { registerBlockType } = wp.blocks;
const { Component } = wp.element;
const { RichText} = wp.editor;
import { TextControl, Button, ExternalLink } from '@wordpress/components';
import { sprintf, _n } from '@wordpress/i18n';
import axios from 'axios'

registerBlockType ( 'tk/ogp-card-block', {
    title: 'LinkOGPCard',
    icon: 'feedback',
    category: 'layout',
    attributes: {
		title: {
			type: 'array',
			source: 'children',
			selector: '.link-card__title',
        },
		url: {
			type: 'string',
			source: 'children',
			selector: '.link-card__anchor',
        }, 
		description: {
			type: 'array',
			source: 'children',
			selector: '.link-card__description',
        }, 
		domain: {
			type: 'array',
			source: 'children',
            selector: '.link-card__domain',
		},                        
		imageSrc: {
			type: 'string',
			source: 'attribute',
			selector: '.link-card__image',
			attribute: 'src',
        },
		imageAlt: {
			type: 'string',
			source: 'attribute',
            attribute: 'alt',
            selector: '.link-card__image'            
        },             
    },
    edit: class extends Component{   
        constructor(props) {
            super(...arguments)
            this.props = props
            this.state={
                isLoading: false,
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
                    })
                    this.props.setAttributes({title: json.title})
                    this.props.setAttributes({description: json.description})                    
                    this.props.setAttributes({domain: this.props.attributes.url.match(/^https?:\/{2,}(.*?)(?:\/|\?|#|$)/)[1]})   
                    if (json.image) {
                        this.props.setAttributes({ imageSrc: json.image})
                        this.props.setAttributes({ imageAlt: json.title})
                                                
                    }
                }).catch((err)=>{
                    console.log(err)
                    this.setState({isLoading: false})
                })
            }
        }
        render () {
            console.log(wp)
            if( this.props.attributes.title[0] == undefined){  
                return (
                    <div className="components-placeholder">
                        <div className="components-placeholder__label">
                            { sprintf(_n('Link OGP Card')) }
                        </div>
                        <div style={{"width":"90%"}}>
                            <TextControl
                            label={sprintf(_n('URLを入力してください')) }
                            onChange={(val)=>{
                                this.props.setAttributes({ url: val})
                            }}
                            />
                            <Button 
                            isPrimary="true"
                            onClick={()=>this.getOGP()}
                            >{sprintf(_n('カードを生成')) }</Button>
                        </div>
                    </div>
                )                    
            } else {            
                return (
                    <div className={ this.props.className }>
                        <a href={this.props.attributes.url} target="_blank">
                       
                            {(() => {
                                if (this.props.attributes.imageSrc){
                                    return (
                                        <div className="link-card__thumbnail-col">
                                        <img className="link-card__image" src={ this.props.attributes.imageSrc }  alt={ this.props.attributes.imageAlt } /> 
                                        </div>
                                    )
                                }
                            }) () }

                            <div class="link-card__detail-col">
                                <div class="link-card__content">
                                    <RichText.Content tagName="p" className="link-card__title" value={ this.props.attributes.title } />
                                    <RichText.Content tagName="p" className="link-card__description" value={ this.props.attributes.description } />
                                </div>
                                <RichText.Content tagName="p" className="link-card__domain" value={ this.props.attributes.domain } />
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
                imageSrc,
                imageAlt,
                description,
                domain,
                url,
            }
        } = props
        return (
            <div className={ className }>
                <a href={url} target="_blank" className="link-card__anchor">
                {(() => {
                    if (imageSrc){
                        return (
                            <div className="link-card__thumbnail-col">
                            <img className="link-card__image" src={ imageSrc  } alt={ imageAlt }  /> 
                            </div>
                        )
                    }
                }) () }                    
     
                    <div class="link-card__detail-col">
                        <div class="link-card__content">
                            <p className="link-card__title">{title}</p>
                            <RichText.Content tagName="p" className="link-card__description" value={ description } />
                        </div>
                        <RichText.Content tagName="p" className="link-card__domain" value={ domain } />
                    </div>
                </a>
            </div>
        )
    }
});
