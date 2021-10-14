<?php

class Mailform {
	
	private $send_address    = '';
	private $thanks_page_url = '';
	
	private $send_subject = '';
	private $send_body    = '';
	
	private $reply_mail            = '';
	private $send_name             = '';
	private $thanks_subject        = '';
	private $thanks_body           = '';
	private $thanks_body_signature = '';
	
	private $javascript_check = '';
	private $spam_check       = '';
	private $domain_name      = '';
	
	
	private $referer = '';
	private $addr    = '';
	private $host    = '';
	private $agent   = '';
	
	private $name_1               = '';
	private $name_2               = '';
	private $read_1               = '';
	private $read_2               = '';
	private $mail_address         = '';
	private $mail_address_confirm = '';
	private $mail_address_empty   = false;
	private $gender               = '';
	private $postal               = '';
	private $address_1            = '';
	private $address_2            = '';
	private $phone                = '';
	private $schedule             = '';
	private $product              = '';
	private $kind                 = array();
	private $kind_separated       = '';
	private $mail_contents        = '';
	
	private $javascript_action  = false;
	private $javascript_comment = '送信前の入力チェックは動作しませんでした。';
	private $now_url            = '';
	private $before_url         = '';
	private $writing_time       = 0;
	private $order_count        = '0';
	private $order_isset        = array();
	
	
	
	
	public function __construct() {
		
		require_once( 'config.php' );
		
		
		$this->send_address    = $rm_send_address;
		$this->thanks_page_url = $rm_thanks_page_url;
		
		$this->send_subject = $rm_send_subject;
		$this->send_body    = $rm_send_body;
		
		$this->reply_mail            = $rm_reply_mail;
		$this->send_name             = $rm_send_name;
		$this->thanks_subject        = $rm_thanks_subject;
		$this->thanks_body           = $rm_thanks_body;
		$this->thanks_body_signature = $rm_thanks_body_signature;
		
		$this->javascript_check = $rm_javascript_check;
		$this->spam_check       = $rm_spam_check;
		$this->domain_name      = $rm_domain_name;
		
		
		$this->post_check();
		
		$this->mail_set();
		
		$this->mail_send();
		
	}
	
	
	
	
	public function post_check() {
		
		if ( isset( $_SERVER['HTTP_REFERER'] ) ) {
			$this->referer = $_SERVER['HTTP_REFERER'];
		}
		
		if ( isset( $_SERVER['REMOTE_ADDR'] ) ) {
			$this->addr = $_SERVER['REMOTE_ADDR'];
		}
		
		if ( isset( $_SERVER['REMOTE_HOST'] ) ) {
			$this->host = $_SERVER['REMOTE_HOST'];
		} else {
			$this->host = gethostbyaddr( $_SERVER['REMOTE_ADDR'] );
		}
		
		if ( isset( $_SERVER['HTTP_USER_AGENT'] ) ) {
			$this->agent = $_SERVER['HTTP_USER_AGENT'];
		}
		
		
		if ( $this->spam_check == 1 && ! empty( $this->domain_name ) ) {
			if ( strpos( $this->referer, $this->domain_name ) === false ) {
				echo '<p>不正な操作が行われたようです。</p>';
				//exit;
			}
		}
		
		
		if ( ! empty( $_POST['name_1'] ) ) {
			$this->name_1 = $this->sanitize_post( $_POST['name_1'] );
			$this->name_1 = mb_convert_kana( $this->name_1, 'KVa' );
		}
		
		if ( ! empty( $_POST['name_2'] ) ) {
			$this->name_2 = $this->sanitize_post( $_POST['name_2'] );
			$this->name_2 = mb_convert_kana( $this->name_2, 'KVa' );
		}
		
		
		if( ! empty( $_POST['read_1'] ) ) {
			$this->read_1 = $this->sanitize_post( $_POST['read_1'] );
			$this->read_1 = mb_convert_kana( $this->read_1, 'KVa' );
		}
		
		if( ! empty( $_POST['read_2'] ) ) {
			$this->read_2 = $this->sanitize_post( $_POST['read_2'] );
			$this->read_2 = mb_convert_kana( $this->read_2, 'KVa' );
		}
		
		
		if ( ! empty( $_POST['mail_address'] ) ) {
			$this->mail_address = $this->sanitize_post( $_POST['mail_address'] );
		}
		
		if ( ! empty( $_POST['mail_address_confirm'] ) ) {
			$this->mail_address_confirm = $this->sanitize_post( $_POST['mail_address_confirm'] );
		}
		
		if ( ! ( empty( $_POST['mail_address'] ) ) && ! ( empty( $_POST['mail_address_confirm'] ) ) ) {
			if ( !( $this->mail_address === $this->mail_address_confirm ) ) {
				echo '<p>メールアドレスが一致しませんでした。</p>';
				exit;
			}
			
			if ( ! preg_match( "/^([a-zA-Z0-9])+([a-zA-Z0-9\._-])*@([a-zA-Z0-9_-])+([a-zA-Z0-9\._-]+)+$/", $this->mail_address ) ) {
				echo '<p>正しくないメールアドレスです。</p>';
				exit;
			}
		} elseif ( empty( $_POST['mail_address'] ) && empty( $_POST['mail_address_confirm'] ) ) {
			$this->mail_address_empty = true;
		} else {
			$this->mail_address_empty = false;
		}
		
		
		if ( ! empty( $_POST['gender'] ) ) {
			$this->gender = $this->sanitize_post( $_POST['gender'] );
		}
		
		
		if ( ! empty( $_POST['postal'] ) ) {
			$this->postal = $this->sanitize_post( $_POST['postal'] );
			$this->postal = mb_convert_kana( $this->postal, 'a' );
			$this->postal = str_replace( array( ' ' ,'-' ), '', $this->postal );
		}
		
		
		if ( ! empty( $_POST['address_1'] ) ) {
			$this->address_1 = $this->sanitize_post( $_POST['address_1'] );
			$this->address_1 = mb_convert_kana( $this->address_1, 'KVa' );
		}
		
		if ( ! empty( $_POST['address_2']) ) {
			$this->address_2 = $this->sanitize_post( $_POST['address_2'] );
			$this->address_2 = mb_convert_kana( $this->address_2, 'KVa' );
		}
		
		
		if ( ! empty( $_POST['phone'] ) ) {
			$this->phone = $this->sanitize_post( $_POST['phone'] );
			$this->phone = mb_convert_kana( $this->phone, 'a' );
		}
		
		
		if ( ! empty( $_POST['schedule'] ) ) {
			$this->schedule = $this->sanitize_post( $_POST['schedule'] );
			$this->schedule = mb_convert_kana( $this->schedule, 'as' );
		}
		
		
		if ( ! empty( $_POST['product'] ) ) {
			$this->product = $this->sanitize_post( $_POST['product'] );
		}
		
		
		if ( ! empty( $_POST['kind'] ) ) {
			foreach( $_POST['kind'] as $key => $value ) {
				$this->kind[] = $this->sanitize_post( $_POST['kind'][$key] );
			}
			$this->kind_separated = implode( '、', $this->kind );
		}
		
		
		if ( ! empty( $_POST['mail_contents'] ) ) {
			$this->mail_contents = $this->sanitize_post( $_POST['mail_contents'] );
			$this->mail_contents = mb_convert_kana( $this->mail_contents, 'KVa' );
		}
		
		
		if( ! empty( $_POST['javascript_action'] ) ) {
			$this->javascript_action = true;
			$this->javascript_comment = '送信前の入力チェックは正常に動作しました。';
		}
		
		
		if ( ! empty( $_POST['now_url'] ) ) {
			$this->now_url = $this->sanitize_post( $_POST['now_url'] );
			$this->now_url = mb_convert_kana( $this->now_url, 'as' );
		}
		
		
		if ( ! empty( $_POST['before_url'] ) ) {
			$this->before_url = $this->sanitize_post( $_POST['before_url'] );
			$this->before_url = mb_convert_kana( $this->before_url, 'as' );
		}
		
		
		if ( ! empty( $_POST['writing_time'] ) ) {
			$this->writing_time = $this->sanitize_post( $_POST['writing_time'] );
			$this->writing_time = mb_convert_kana( $this->writing_time, 'a' );
		}
		
		
		if ( $this->javascript_check == 1 && $this->javascript_action === false ) {
			echo '<p>不正な操作が行われたようです。</p>';
			exit;
		}
		
		
		if ( ! empty( $_POST['order_count'] ) ) {
			$this->order_count = $this->sanitize_post( $_POST['order_count'] );
			$this->order_count = mb_convert_kana( $this->order_count, 'KVa' );
		}
		
		
		for ( $i = 1; $i < $this->order_count + 1; $i++ ) {
			if ( ! empty( $_POST['order_'.$i] ) ) {
				$this->order_isset[$i] = $this->sanitize_post( $_POST['order_'.$i] );
				$this->order_isset[$i] = mb_convert_kana( $this->order_isset[$i], 'KVa' );
				$this->order_isset[$i] = explode( ",", $this->order_isset[$i] );
			}
		}
		
	}
	
	
	
	
	public function mail_set() {
		
		$send_date = date( 'Y / m / d　H:i:s' );
		
		
		$this->send_body .= '-----------------------------------------------------------------------------------'.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【송신 시간】'.PHP_EOL;
		$this->send_body .= $send_date.''.PHP_EOL;
		
		for ( $i = 1; $i < $this->order_count + 1; $i++ ) {
			switch ( $this->order_isset[$i][0] ) {
				
				case 'name_1':
					if ( $this->name_1 !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->name_1.'　'.$this->name_2.''.PHP_EOL;
					}
					break;
				
				case 'read_1':
					if ( $this->read_1 !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->read_1.'　'.$this->read_2.''.PHP_EOL;
					}
					break;
				
				case 'mail_address':
					if ( $this->mail_address !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->mail_address.''.PHP_EOL;
					}
					break;
				
				case 'gender':
					if ( $this->gender !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->gender.''.PHP_EOL;
					}
					break;
				
				case 'postal':
					if ( $this->postal !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->postal.''.PHP_EOL;
					}
					break;
				
				case 'address_1':
					if ( $this->address_1 !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->address_1.''.PHP_EOL;
					}
					if ( $this->address_2 !== '' ) {
						$this->send_body .= $this->address_2.''.PHP_EOL;
					}
					break;
				
				case 'phone':
					if ( $this->phone !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->phone.''.PHP_EOL;
					}
					break;
				
				case 'schedule':
					if ( $this->schedule !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->schedule.''.PHP_EOL;
					}
					break;
				
				case 'product':
					if ( $this->product !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->product.''.PHP_EOL;
					}
					break;
				
				case 'kind':
					if ( $this->kind_separated !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->kind_separated.''.PHP_EOL;
					}
					break;
				
				case 'mail_contents':
					if ( $this->mail_contents !== '' ) {
						$this->send_body .= ''.PHP_EOL;
						$this->send_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->send_body .= $this->mail_contents.''.PHP_EOL;
					}
					break;
				
			}
		}
		
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '-----------------------------------------------------------------------------------'.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【IP address】'.PHP_EOL;
		$this->send_body .= $this->addr.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【host】'.PHP_EOL;
		$this->send_body .= $this->host.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【browser】'.PHP_EOL;
		$this->send_body .= $this->agent.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【check】'.PHP_EOL;
		$this->send_body .= $this->javascript_comment.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【form URL】'.PHP_EOL;
		$this->send_body .= $this->now_url.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【URL】'.PHP_EOL;
		$this->send_body .= $this->before_url.''.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		$this->send_body .= '【time】'.PHP_EOL;
		$this->send_body .= $this->writing_time.'sec'.PHP_EOL;
		$this->send_body .= ''.PHP_EOL;
		
		
		$this->thanks_body .= '-----------------------------------------------------------------------------------'.PHP_EOL;
		$this->thanks_body .= ''.PHP_EOL;
		$this->thanks_body .= '【송신 시간】'.PHP_EOL;
		$this->thanks_body .= $send_date.''.PHP_EOL;
		
		for ( $i = 1; $i < $this->order_count + 1; $i++ ) {
			switch ( $this->order_isset[$i][0] ) {
				
				case 'name_1':
					if ( $this->name_1 !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->name_1.'　'.$this->name_2.''.PHP_EOL;
					}
					break;
				
				case 'read_1':
					if ( $this->read_1 !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->read_1.'　'.$this->read_2.''.PHP_EOL;
					}
					break;
				
				case 'mail_address':
					if ( $this->mail_address !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->mail_address.''.PHP_EOL;
					}
					break;
				
				case 'gender':
					if ( $this->gender !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->gender.''.PHP_EOL;
					}
					break;
				
				case 'postal':
					if ( $this->postal !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->postal.''.PHP_EOL;
					}
					break;
				
				case 'address_1':
					if ( $this->address_1 !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->address_1.''.PHP_EOL;
					}
					if ( $this->address_2 !== '' ) {
						$this->thanks_body .= $this->address_2.''.PHP_EOL;
					}
					break;
				
				case 'phone':
					if ( $this->phone !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->phone.''.PHP_EOL;
					}
					break;
				
				case 'schedule':
					if ( $this->schedule !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->schedule.''.PHP_EOL;
					}
					break;
				
				case 'product':
					if ( $this->product !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->product.''.PHP_EOL;
					}
					break;
				
				case 'kind':
					if ( $this->kind_separated !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->kind_separated.''.PHP_EOL;
					}
					break;
				
				case 'mail_contents':
					if ( $this->mail_contents !== '' ) {
						$this->thanks_body .= ''.PHP_EOL;
						$this->thanks_body .= '【'.$this->order_isset[$i][1].'】'.PHP_EOL;
						$this->thanks_body .= $this->mail_contents.''.PHP_EOL;
					}
					break;
				
			}
		}
		
		$this->thanks_body .= ''.PHP_EOL;
		$this->thanks_body .= '-----------------------------------------------------------------------------------'.PHP_EOL;
		$this->thanks_body .= $this->thanks_body_signature;
		
	}
	
	
	
	
	public function mail_send() {
		
		if ( $this->mail_address_empty === false ) {
			$additional_headers = "From: ".$this->mail_address."\r\n";
		} else {
			$additional_headers = "From: ".$this->send_address."\r\n";
		}
		
		$my_result = mb_send_mail( $this->send_address, $this->send_subject, $this->send_body, $additional_headers );
		
		
		if ( $this->reply_mail == 1 ) {
			
			$this->send_name                 = mb_encode_mimeheader( $this->send_name, 'ISO-2022-JP' );
			$thanks_additional_headers = "From: ".$this->send_name." <".$this->send_address.">";
			
			if ( $this->mail_address_empty === false ) {
				$you_result = mb_send_mail( $this->mail_address, $this->thanks_subject, $this->thanks_body, $thanks_additional_headers );
			}else{
				$you_result = true;
			}
			
		}
		
		
		switch ( $this->reply_mail ) {
			case 0:
				if ( $my_result ) {
					header( 'Location: '.$this->thanks_page_url );
				} else {
					echo '<p>エラーが起きました。<br />ご迷惑をおかけして大変申し訳ありません。</p>';
					exit;
				}
				break;
			
			case 1:
				if ( $my_result && $you_result ) {
					header( 'Location: '.$this->thanks_page_url );
				} else {
					echo '<p>エラーが起きました。<br />ご迷惑をおかけして大変申し訳ありません。</p>';
					exit;
				}
				break;
		}
		
	}
	
	
	
	
	public function sanitize_post( $p ) {
		$p = htmlspecialchars( $p, ENT_QUOTES, 'UTF-8' );
		return $p;
	}
	
}

?>