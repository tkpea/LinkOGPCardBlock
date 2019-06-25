<?php
/*
Plugin Name: LinkCardBlock
Plugin URI: (プラグインの説明と更新を示すページの URI)
Description: (プラグインの短い説明)
Version: (プラグインのバージョン番号。例: 1.0)
Author: (プラグイン作者の名前)
Author URI: (プラグイン作者の URI)
License: (ライセンス名の「スラッグ」 例: GPL2)
*/
require_once(plugin_dir_path(__FILE__) . 'lib/OpenGraph.php');
class LinkCardBlock
{
    public function __construct()
    {
        $this->name = "link_card_block";
        $this->init();
        $this->getOGP();
    }
    private function init()
    {
        add_action('enqueue_block_editor_assets', function () {
            wp_enqueue_style($this->name   . '_style', plugins_url('css/style.css', __FILE__));
            wp_enqueue_script($this->name  . '_script', plugins_url('build/index.js', __FILE__), array(), "", true);
            add_action($this->name  . '_styles', 'add_link_card_block_editor_admin_styles');
        });

        add_action('wp_enqueue_scripts', function () {
            wp_enqueue_style($this->name  . '_style', plugins_url('css/style.css', __FILE__));
        });
    }
    private function getOGP()
    {
        add_action('wp_ajax_myplugin_get_ogp', function () {

            $graph = OpenGraph::fetch($_POST["url"]);


            $array = [];
            foreach ($graph as $key => $val) {
                $array += [$key => $val, "UTF-8", "auto"];
            }

            echo json_encode($array);
            die();
        });
    }
}

new LinkCardBlock();
