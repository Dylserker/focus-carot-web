<p>Bienvenue sur le site {{ nom }}</p>
<ul>
    {% foreach users %}
    <li>{{ name }} qui a {{ age }} et habite {{ location }}</li>
    {% endforeach %}
</ul>