@props(['url'])
<tr>
<td class="header">
<a href="{{ $url }}" style="display: inline-block;">
@if (trim($slot) === 'Laravel')
<img src="https://companieslogo.com/img/orig/UNTR.JK-97580c63.png?t=1730111365" class="logo" alt="United Tractors Logo">
@else
{!! $slot !!}
@endif
</a>
</td>
</tr>
