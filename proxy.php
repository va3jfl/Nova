<?php
/**
 * NOVA news proxy — upload next to nova.html.
 * Browsers can't fetch RSS feeds cross-origin, so the news skill asks
 * this tiny script to fetch them server-side. It is NOT an open proxy:
 * only the hosts whitelisted below are allowed.
 *
 * Add more feeds by adding their hostname here and (optionally) changing
 * the feed URL inside nova.html's news skill.
 */
$ALLOWED_HOSTS = [
    'feeds.bbci.co.uk',
    'rss.cnn.com',
    'feeds.npr.org',
    'moxie.foxnews.com',
    'rss.nytimes.com',
];

$url = isset($_GET['url']) ? $_GET['url'] : '';
$host = parse_url($url, PHP_URL_HOST);
$scheme = parse_url($url, PHP_URL_SCHEME);

if (!$url || !in_array($host, $ALLOWED_HOSTS, true) || !in_array($scheme, ['http', 'https'], true)) {
    http_response_code(403);
    exit('Forbidden: host not in whitelist');
}

$ctx = stream_context_create(['http' => ['timeout' => 10, 'user_agent' => 'NOVA-assistant/1.1']]);
$body = @file_get_contents($url, false, $ctx);

if ($body === false) {
    http_response_code(502);
    exit('Upstream fetch failed');
}

header('Content-Type: text/xml; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Cache-Control: max-age=300');   // cache headlines for 5 minutes
echo $body;
